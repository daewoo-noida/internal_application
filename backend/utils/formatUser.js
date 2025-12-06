module.exports = function formatUser(user) {
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        designation: user.designation,
        role: user.role,
        gender: user.gender,
        dob: user.dob,
        officeBranch: user.officeBranch,
        profileImage: user.profileImage,
        isVerified: user.isVerified,
        createdAt: user.createdAt
    };
};
