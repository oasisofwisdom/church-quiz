# BBC 7.0 - Back to the Bible Challenge Quiz Platform

A professional, real-time quiz platform designed for churches and fellowship groups. Built with React, TypeScript, and Tailwind CSS.

## 🎯 Features

### For Participants
- **Easy Login**: Just enter your fellowship name - no complex registration
- **Real-time Quiz**: See questions and timers as the admin controls them
- **Live Leaderboard**: Watch your fellowship climb the rankings in real-time
- **Instant Feedback**: Know immediately if your answer was correct
- **Beautiful UI**: Clean, modern interface optimized for engagement

### For Admins
- **Full Control**: Manage every aspect of the quiz experience
- **Question Management**: Import/export questions via CSV or JSON
- **Timer Control**: Start/stop 15-second timers with visual countdown
- **Live Monitoring**: See which questions have been answered and by whom
- **Navigation**: Next/previous buttons for easy question flow
- **Answer Reveal**: Show correct answers to all participants when ready
- **Book Sections**: Organized by Bible books (Joshua, 1 Kings, Proverbs, Romans, James, General Bible Knowledge)

## 🚀 Quick Start

### Running Locally

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser** and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder, ready for deployment.

### Free Hosting on GitHub Pages

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Upload to GitHub**:
   - Create a new GitHub repository
   - Upload all files from the `dist` folder
   - Go to Settings > Pages
   - Select main branch and / (root) folder
   - Click Save

3. **Your site will be live** at: `https://yourusername.github.io/repository-name/`

## 📋 How to Use

### For Quiz Administrators

1. **Login**:
   - Click "Enter as Admin" on the home page
   - Default password: `bbcadmin2026` (change this in the code for security)

2. **Prepare Questions**:
   - Use the "Question Management" section to import questions
   - Upload a CSV file OR paste JSON directly
   - See "Question Format" section below for details

3. **During the Quiz**:
   - Select a question from the question bank
   - Click "Show Question" to display it to participants
   - Click "Start Timer" to begin the 15-second countdown
   - Click "Show Answer" when ready to reveal the correct answer
   - Use "Next"/"Previous" to navigate between questions
   - Monitor the live leaderboard on the right side

4. **Track Progress**:
   - Green checkmarks show answered questions
   - See which fellowship answered each question
   - Watch scores update in real-time

### For Participants

1. **Join the Quiz**:
   - Click "Enter as Participant" on the home page
   - Enter your fellowship name (e.g., "Youth Fellowship", "Women's Ministry")

2. **Wait for Start**:
   - You'll see a "Waiting for Quiz to Begin" message
   - The screen will automatically update when the admin starts

3. **Answer Questions**:
   - When a question appears, select your answer quickly
   - You have 15 seconds before the timer runs out
   - Points are awarded only for correct answers

4. **Track Your Progress**:
   - See your fellowship's score and rank on the right
   - Watch the live leaderboard update
   - View how many questions you've answered

## 📊 Question Formats

### CSV Format (Recommended for Ease)

Create a CSV file with this structure:

```csv
Book,Question,Option1,Option2,Option3,Option4,CorrectAnswer,Points
Joshua,Who was Joshua's father?,Nun,Caleb,Moses,Aaron,0,10
Joshua,How many days did the Israelites march around Jericho?,7,6,40,12,1,10
Proverbs,What is the beginning of wisdom?,The fear of the Lord,Understanding,Knowledge,Discipline,0,15
```

**Columns:**
1. **Book**: Must be one of: Joshua, 1 Kings, Proverbs, Romans, James, General Bible Knowledge
2. **Question**: The question text
3-6. **Option1-Option4**: The four answer choices
7. **CorrectAnswer**: Index (0-3) of the correct answer
8. **Points**: Points awarded for correct answer (default: 10)

### JSON Format

```json
[
  {
    "id": "joshua-1",
    "book": "Joshua",
    "text": "Who was Joshua's father?",
    "options": ["Nun", "Caleb", "Moses", "Aaron"],
    "correctAnswer": 0,
    "points": 10
  }
]
```

## 🎨 Customization

### Changing the Admin Password

Edit the default password in `src/context/QuizContext.tsx`:

```typescript
const initialState: QuizState = {
  // ...
  adminPass: 'your-new-password-here',
  // ...
};
```

### Adding More Bible Books

Edit the books array in `src/context/QuizContext.tsx`:

```typescript
books: ['Joshua', '1 Kings', 'Proverbs', 'Romans', 'James', 'General Bible Knowledge', 'Your New Book'],
```

### Changing Timer Duration

Edit the timer duration in `src/pages/Admin.tsx`:

```typescript
const handleStartTimer = () => {
  dispatch({ type: 'START_TIMER', duration: 20 }); // Change from 15 to 20 seconds
};
```

### Styling & Branding

- **Colors**: Edit Tailwind classes throughout components
- **Logo**: Replace the BookOpen icon in `src/App.tsx`
- **Church Name**: Update "Oasis of Wisdom Bible Church" in multiple files
- **Theme**: Modify the gradient backgrounds and color schemes

## 💾 Data Persistence

The platform uses **localStorage** to persist data:

- **Quiz state**: Automatically saved and synced across tabs
- **Fellowship names**: Participants remain logged in on refresh
- **Questions**: Imported questions are saved in browser storage

**Note**: For permanent question storage, export your questions as JSON and save them externally.

## 🛠️ Technical Details

### Built With
- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Lucide React** - Icons
- **Vite** - Build Tool

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### No Backend Required
This is a **pure frontend application** that runs entirely in the browser. It uses:
- localStorage for data persistence
- Storage events for real-time sync between tabs
- No server costs or complex setup

## 📱 Mobile Responsiveness

The platform is fully responsive and works great on:
- Desktop computers (optimal for admin controls)
- Tablets (great for both admin and participants)
- Mobile phones (perfect for participants)

## 🎉 Tips for a Successful Quiz

1. **Test First**: Run through the quiz once before the actual event
2. **Prepare Questions**: Have all questions ready in CSV format
3. **Stable Internet**: Ensure good connectivity for all participants
4. **Projector Setup**: Connect admin screen to projector for everyone to see
5. **Practice Navigation**: Familiarize yourself with the controls
6. **Backup Plan**: Export questions so you have a backup

## 🤝 Contributing

This is built for church communities. Feel free to:
- Fork the repository
- Submit pull requests
- Report issues
- Suggest features

## 📄 License

MIT License - Free for church and non-commercial use.

## 🙏 Acknowledgments

Built with love for Oasis of Wisdom Bible Church and the broader Christian community.

**BBC 7.0 - Back to the Bible Challenge**
- Theme: Walking in Covenant Perfection (Matthew 5:48)
- Motto: BBC! The Word in my heart and acts. BB&C! Believing and behaving the Bible!

---

**Need Help?** Contact your technical team or open an issue on GitHub.
