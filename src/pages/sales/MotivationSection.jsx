import DailyCarousel from "./DailyCarousel";

export default function MotivationSection() {

    const cards = [
        {
            title: "Quote Of The Day",
            quote: "Success is not final, failure is not fatal. It is the courage to continue that counts.",
            author: "- Winston Churchill"
        },
        {
            title: "Innovation Boost",
            quote: "Innovation is seeing what everybody has seen and thinking what nobody has thought.",
            author: "- Albert Szent-Györgyi"
        },
        {
            title: "Mindset Growth",
            quote: "Your life does not get better by chance, it gets better by change.",
            author: "- Jim Rohn"
        },
        {
            title: "Sales Weapon",
            quote: "Every ‘no’ brings you closer to the right ‘yes’.",
            author: "- Grant Cardone"
        },
        {
            title: "Target Breaker",
            quote: "The harder you work for something, the greater you’ll feel when you achieve it.",
            author: "- Anonymous"
        },
        {
            title: "Closing Power",
            quote: "If you don’t ask, the answer is always no.",
            author: "- Nora Roberts"
        },
        {
            title: "Growth Mindset",
            quote: "Small progress each day adds up to big results.",
            author: "- Anonymous"
        },
        {
            title: "Discipline Boost",
            quote: "Discipline is choosing what you want most over what you want now.",
            author: "- Abraham Lincoln"
        },
        {
            title: "Focus Mode",
            quote: "Starve your distractions, feed your focus.",
            author: "- Anonymous"
        },
        {
            title: "Hustle Spirit",
            quote: "Great things never come from comfort zones.",
            author: "- Anonymous"
        },
        {
            title: "Energy Booster",
            quote: "Your energy introduces you before you speak.",
            author: "- Anonymous"
        },
        {
            title: "Sales Wisdom",
            quote: "People don’t buy products. They buy solutions to their problems.",
            author: "- Zig Ziglar"
        },
        {
            title: "Leadership Spark",
            quote: "A leader is one who knows the way, goes the way, and shows the way.",
            author: "- John C. Maxwell"
        },
        {
            title: "Winning Mindset",
            quote: "You don’t need to be perfect. You need to be consistent.",
            author: "- Anonymous"
        },
        {
            title: "Action Force",
            quote: "The key to success is to start before you are ready.",
            author: "- Marie Forleo"
        },
        {
            title: "Confidence Boost",
            quote: "Believe you can and you're halfway there.",
            author: "- Theodore Roosevelt"
        },
        {
            title: "Persistence Mode",
            quote: "Fall seven times, stand up eight.",
            author: "- Japanese Proverb"
        },
        {
            title: "Sales Fire",
            quote: "The difference between ordinary and extraordinary is that little extra.",
            author: "- Jimmy Johnson"
        },
        {
            title: "Performance Push",
            quote: "Don't watch the clock; do what it does. Keep going.",
            author: "- Sam Levenson"
        },
        {
            title: "Peak Potential",
            quote: "Success usually comes to those who are too busy to be looking for it.",
            author: "- Henry David Thoreau"
        },
        {
            title: "Sales Sharpshooter",
            quote: "Opportunities don’t happen. You create them.",
            author: "- Chris Grosser"
        },
        {
            title: "Momentum Charge",
            quote: "Do something today your future self will thank you for.",
            author: "- Anonymous"
        },
        {
            title: "Winning Habit",
            quote: "Motivation gets you started. Habit keeps you going.",
            author: "- Jim Rohn"
        },
        {
            title: "Sales Warrior",
            quote: "If you are not taking care of your customer, your competitor will.",
            author: "- Bob Hooey"
        },
        {
            title: "Clarity Boost",
            quote: "Where focus goes, energy flows.",
            author: "- Tony Robbins"
        },
        {
            title: "Goal Setter",
            quote: "A goal without a plan is just a wish.",
            author: "- Antoine de Saint-Exupéry"
        },
        {
            title: "Drive Mode",
            quote: "You miss 100% of the shots you don’t take.",
            author: "- Wayne Gretzky"
        },
        {
            title: "Sales Trigger",
            quote: "Your customers are buying the feeling, not the product.",
            author: "- Anonymous"
        },
        {
            title: "Growth Push",
            quote: "Don’t limit your challenges. Challenge your limits.",
            author: "- Anonymous"
        },
        {
            title: "Impact Quote",
            quote: "Make your life a masterpiece; imagine no limitations.",
            author: "- Brian Tracy"
        }
    ];

    return (
        <div className="bg-gray-50 rounded-xl p-6 border h-full flex flex-col">
            {/* Carousel Component */}
            <div className="flex-1">
                <DailyCarousel items={cards} />
            </div>
        </div>
    );
}
