const Meeting = require('../models/Meeting');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');

// Create meeting and send invites
exports.createMeeting = async (req, res) => {
    try {
        const { title, description, date, time, duration, location, invitedUsers, agenda } = req.body;
        const adminUser = req.user;

        // Validate required fields
        if (!title || !date || !time || !location || !agenda) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        if (!invitedUsers || !Array.isArray(invitedUsers) || invitedUsers.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Please select at least one salesperson'
            });
        }

        // Format date for display
        const meetingDate = new Date(date);
        const formattedDate = meetingDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Create meeting
        const meeting = new Meeting({
            title,
            description,
            date: meetingDate,
            time,
            duration,
            location,
            agenda,
            createdBy: adminUser._id,
            invitedUsers: invitedUsers.map(user => ({
                userId: user.userId,
                email: user.email,
                name: user.name,
                status: 'pending'
            }))
        });

        await meeting.save();

        // Send emails to all invited users
        const emailPromises = invitedUsers.map(async (user) => {
            try {
                const acceptLink = `${process.env.FRONTEND_URL}/meeting-response?meetingId=${meeting._id}&userId=${user.userId}&status=accepted`;
                const declineLink = `${process.env.FRONTEND_URL}/meeting-response?meetingId=${meeting._id}&userId=${user.userId}&status=declined`;

                const emailHtml = `
                    <!DOCTYPE html>
                    <html>
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Meeting Invitation</title>
                        <style>
                            body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                line-height: 1.6;
                                color: #333;
                                max-width: 600px;
                                margin: 0 auto;
                                padding: 20px;
                                background-color: #f9f9f9;
                            }
                            .header {
                                background: linear-gradient(135deg, #0066b3 0%, #0070b9 100%);
                                color: white;
                                padding: 30px;
                                border-radius: 10px 10px 0 0;
                                text-align: center;
                            }
                            .header h1 {
                                margin: 0;
                                font-size: 24px;
                            }
                            .content {
                                background: white;
                                padding: 30px;
                                border-radius: 0 0 10px 10px;
                                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                            }
                            .meeting-details {
                                background: #f8f9fa;
                                padding: 20px;
                                border-radius: 8px;
                                margin: 20px 0;
                            }
                            .detail-item {
                                margin-bottom: 10px;
                                display: flex;
                                align-items: flex-start;
                            }
                            .detail-icon {
                                width: 20px;
                                margin-right: 10px;
                                color: #0066b3;
                            }
                            .action-buttons {
                                text-align: center;
                                margin: 30px 0;
                            }
                            .btn {
                                display: inline-block;
                                padding: 12px 30px;
                                margin: 0 10px;
                                border-radius: 6px;
                                text-decoration: none;
                                font-weight: 600;
                                font-size: 14px;
                                transition: all 0.3s ease;
                            }
                            .btn-accept {
                                background-color: #28a745;
                                color: white;
                            }
                            .btn-accept:hover {
                                background-color: #218838;
                            }
                            .btn-decline {
                                background-color: #dc3545;
                                color: white;
                            }
                            .btn-decline:hover {
                                background-color: #c82333;
                            }
                            .footer {
                                text-align: center;
                                margin-top: 30px;
                                padding-top: 20px;
                                border-top: 1px solid #eee;
                                color: #666;
                                font-size: 12px;
                            }
                            .logo {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            .logo img {
                                max-height: 40px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="logo">
                            <img src="https://your-logo-url.com/logo.png" alt="Company Logo">
                        </div>
                        
                        <div class="header">
                            <h1>Meeting Invitation</h1>
                            <p>You're invited to attend an important meeting</p>
                        </div>
                        
                        <div class="content">
                            <h2>${title}</h2>
                            
                            <div class="meeting-details">
                                <div class="detail-item">
                                    <span class="detail-icon">📅</span>
                                    <strong>Date:</strong> ${formattedDate}
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon">⏰</span>
                                    <strong>Time:</strong> ${time}
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon">⏱️</span>
                                    <strong>Duration:</strong> ${duration} minutes
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon">📍</span>
                                    <strong>Location:</strong> ${location}
                                </div>
                                <div class="detail-item">
                                    <span class="detail-icon">📋</span>
                                    <strong>Agenda:</strong> ${agenda}
                                </div>
                            </div>
                            
                            ${description ? `
                            <div style="margin: 20px 0;">
                                <h3>Description:</h3>
                                <p>${description}</p>
                            </div>
                            ` : ''}
                            
                            <div class="action-buttons">
                                <p style="margin-bottom: 15px; font-weight: 600;">Please respond to this invitation:</p>
                                <a href="${acceptLink}" class="btn btn-accept">✅ Accept</a>
                                <a href="${declineLink}" class="btn btn-decline">❌ Decline</a>
                            </div>
                            
                            <div style="background-color: #fff3cd; padding: 15px; border-radius: 6px; border-left: 4px solid #ffc107; margin: 20px 0;">
                                <p style="margin: 0; color: #856404;">
                                    <strong>Note:</strong> Your response will be recorded in the system.
                                </p>
                            </div>
                            
                            <div style="margin-top: 30px; padding: 15px; background-color: #e9ecef; border-radius: 6px;">
                                <p style="margin: 0; font-size: 14px;">
                                    <strong>Organizer:</strong> ${adminUser.name}<br>
                                    <strong>Email:</strong> ${adminUser.email}
                                </p>
                            </div>
                        </div>
                        
                        <div class="footer">
                            <p>This is an automated message from Daewoo EBG Meeting System.</p>
                            <p>Please do not reply to this email.</p>
                        </div>
                    </body>
                    </html>
                `;

                // Use your existing sendEmail function
                await sendEmail(user.email, `Meeting Invitation: ${title}`, emailHtml);

                console.log(`✅ Email sent to ${user.email}`);

            } catch (emailError) {
                console.error(`❌ Failed to send email to ${user.email}:`, emailError);
                // Don't fail the whole operation if one email fails
            }
        });

        // Send emails in parallel but don't wait for all
        Promise.all(emailPromises.map(p => p.catch(e => e)));

        res.status(201).json({
            success: true,
            message: 'Meeting created successfully. Invitations are being sent.',
            meeting
        });

    } catch (error) {
        console.error('Error creating meeting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create meeting',
            error: error.message
        });
    }
};

// Get all salespersons for autocomplete
exports.getSalesPersons = async (req, res) => {
    try {
        const search = req.query.search || '';

        const salespersons = await User.find({
            role: 'sales',
            $or: [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { designation: { $regex: search, $options: 'i' } },
                { officeBranch: { $regex: search, $options: 'i' } }
            ]
        })
            .select('name email profileImage designation officeBranch')
            .sort({ name: 1 })
            .limit(20);

        res.json({
            success: true,
            users: salespersons
        });
    } catch (error) {
        console.error('Error fetching salespersons:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch salespersons'
        });
    }
};

// Get all meetings for admin
exports.getAdminMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({ createdBy: req.user.id })
            .populate('createdBy', 'name email')
            .sort({ date: -1, time: -1 });

        // Calculate response stats
        const meetingsWithStats = meetings.map(meeting => {
            const invited = meeting.invitedUsers.length;
            const accepted = meeting.invitedUsers.filter(u => u.status === 'accepted').length;
            const declined = meeting.invitedUsers.filter(u => u.status === 'declined').length;
            const pending = invited - accepted - declined;

            return {
                ...meeting.toObject(),
                stats: { invited, accepted, declined, pending }
            };
        });

        res.json({
            success: true,
            meetings: meetingsWithStats
        });
    } catch (error) {
        console.error('Error fetching admin meetings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meetings'
        });
    }
};

// Get meetings for salesperson
exports.getUserMeetings = async (req, res) => {
    try {
        const meetings = await Meeting.find({
            'invitedUsers.userId': req.user.id
        })
            .populate('createdBy', 'name email')
            .sort({ date: -1, time: -1 });

        res.json({
            success: true,
            meetings
        });
    } catch (error) {
        console.error('Error fetching user meetings:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meetings'
        });
    }
};

// Handle meeting response from email link
exports.handleEmailResponse = async (req, res) => {
    try {
        const { meetingId, userId, status } = req.query;

        if (!meetingId || !userId || !status) {
            return res.status(400).send('Invalid request parameters');
        }

        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).send('Meeting not found');
        }

        // Update user's response
        const userIndex = meeting.invitedUsers.findIndex(
            user => user.userId.toString() === userId
        );

        if (userIndex === -1) {
            return res.status(403).send('You are not invited to this meeting');
        }

        meeting.invitedUsers[userIndex].status = status;
        meeting.invitedUsers[userIndex].respondedAt = new Date();

        await meeting.save();

        // Send a confirmation email
        const userEmail = meeting.invitedUsers[userIndex].email;
        const subject = `Meeting ${status.charAt(0).toUpperCase() + status.slice(1)}: ${meeting.title}`;

        const confirmationHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0066b3;">Meeting Response Confirmation</h2>
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 10px;">
                    <h3>${meeting.title}</h3>
                    <p><strong>Date:</strong> ${meeting.date.toLocaleDateString()} at ${meeting.time}</p>
                    <p><strong>Status:</strong> <span style="color: ${status === 'accepted' ? 'green' : 'red'}; font-weight: bold;">
                        ${status.toUpperCase()}
                    </span></p>
                    <p>Thank you for your response. The meeting organizer has been notified.</p>
                </div>
                <p style="margin-top: 20px; color: #666;">
                    This is an automated confirmation email.
                </p>
            </div>
        `;

        try {
            await sendEmail(userEmail, subject, confirmationHtml);
        } catch (emailError) {
            console.error('Error sending confirmation email:', emailError);
        }

        // Redirect to a thank you page or show a message
        res.send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Meeting Response</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #0066b3 0%, #0070b9 100%);
                        margin: 0;
                    }
                    .container {
                        background: white;
                        padding: 40px;
                        border-radius: 15px;
                        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                        text-align: center;
                        max-width: 500px;
                    }
                    .icon {
                        font-size: 60px;
                        margin-bottom: 20px;
                    }
                    h1 {
                        color: #0066b3;
                        margin-bottom: 20px;
                    }
                    p {
                        color: #666;
                        line-height: 1.6;
                    }
                    .btn {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 10px 30px;
                        background: #0066b3;
                        color: white;
                        text-decoration: none;
                        border-radius: 5px;
                        font-weight: bold;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="icon">
                        ${status === 'accepted' ? '✅' : '❌'}
                    </div>
                    <h1>Response Recorded!</h1>
                    <p>
                        You have successfully <strong>${status}</strong> the meeting:<br>
                        <strong>"${meeting.title}"</strong>
                    </p>
                    <p>A confirmation email has been sent to your inbox.</p>
                    <p style="font-size: 14px; color: #888; margin-top: 30px;">
                        You can close this window now.
                    </p>
                </div>
            </body>
            </html>
        `);

    } catch (error) {
        console.error('Error handling email response:', error);
        res.status(500).send('Internal server error');
    }
};

// Update meeting response (from UI)
exports.updateResponse = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { status } = req.body;
        const userId = req.user.id;

        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        // Update user's response
        const userIndex = meeting.invitedUsers.findIndex(
            user => user.userId.toString() === userId.toString()
        );

        if (userIndex === -1) {
            return res.status(403).json({
                success: false,
                message: 'You are not invited to this meeting'
            });
        }

        meeting.invitedUsers[userIndex].status = status;
        meeting.invitedUsers[userIndex].respondedAt = new Date();

        await meeting.save();

        // Also update in the user's own dashboard via WebSocket if needed
        res.json({
            success: true,
            message: `Meeting ${status} successfully`,
            meeting
        });
    } catch (error) {
        console.error('Error updating response:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update response'
        });
    }
};

// Delete meeting
exports.deleteMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;

        const meeting = await Meeting.findById(meetingId);

        if (!meeting) {
            return res.status(404).json({
                success: false,
                message: 'Meeting not found'
            });
        }

        // Check if user created this meeting
        if (meeting.createdBy.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this meeting'
            });
        }

        await meeting.deleteOne();

        res.json({
            success: true,
            message: 'Meeting deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting meeting:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete meeting'
        });
    }
};

// Get meeting statistics for admin dashboard
exports.getMeetingStats = async (req, res) => {
    try {
        const meetings = await Meeting.find({ createdBy: req.user.id });

        const stats = {
            totalMeetings: meetings.length,
            upcomingMeetings: meetings.filter(m => new Date(m.date) >= new Date()).length,
            totalInvites: meetings.reduce((sum, m) => sum + m.invitedUsers.length, 0),
            acceptedInvites: meetings.reduce((sum, m) => sum + m.invitedUsers.filter(u => u.status === 'accepted').length, 0),
            declinedInvites: meetings.reduce((sum, m) => sum + m.invitedUsers.filter(u => u.status === 'declined').length, 0),
            pendingInvites: meetings.reduce((sum, m) => sum + m.invitedUsers.filter(u => u.status === 'pending').length, 0)
        };

        res.json({
            success: true,
            stats
        });
    } catch (error) {
        console.error('Error fetching meeting stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch meeting statistics'
        });
    }
};