# Deploying BBC 7.0 to GitHub Pages

This guide will help you deploy the BBC 7.0 Quiz Platform to GitHub Pages for free hosting.

## Prerequisites

1. A GitHub account (free)
2. Git installed on your computer
3. Node.js and npm installed

## Step-by-Step Deployment

### 1. Build the Project

First, build the project for production:

```bash
npm run build
```

This creates a `dist` folder with all the files needed for deployment.

### 2. Create a GitHub Repository

1. Go to [github.com](https://github.com) and create a new repository
2. Name it something like `bbc-quiz` or `bbc-7-0`
3. Make it public (required for GitHub Pages on free accounts)
4. Click "Create repository"

### 3. Upload Files to GitHub

#### Option A: Using Git (Recommended)

```bash
# Initialize git repository
git init

# Add the files
git add .

# Commit the files
git commit -m "Initial commit of BBC 7.0 Quiz Platform"

# Connect to GitHub (replace with your username and repo name)
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git

# Push to GitHub
git push -u origin main
```

#### Option B: Using GitHub Web Interface

1. On your repository page, click "Add file" > "Upload files"
2. Drag and drop all files from the `dist` folder
3. Click "Commit changes"

### 4. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" (the gear icon)
3. Scroll down to the "Pages" section in the left sidebar
4. Under "Build and deployment", select:
   - Source: "Deploy from a branch"
   - Branch: "main"
   - Folder: "/ (root)"
5. Click "Save"

### 5. Wait for Deployment

GitHub will now build and deploy your site. This usually takes 1-2 minutes.

- You'll see a message: "Your site is being built..."
- Once complete, you'll see: "Your site is live at https://your-username.github.io/your-repo-name/"

### 6. Access Your Quiz Platform

Visit the URL provided by GitHub Pages. Share this link with your participants!

## Custom Domain (Optional)

If you want to use a custom domain (like `quiz.my-church.org`):

1. In the GitHub Pages settings, add your custom domain under "Custom domain"
2. Configure your DNS provider with the CNAME record GitHub provides
3. Wait for DNS propagation (can take up to 24 hours)

## Updating Your Quiz Platform

When you need to update questions or make changes:

1. Make your changes locally
2. Run `npm run build` again
3. Commit and push the changes:
   ```bash
   git add .
   git commit -m "Updated questions for new quiz"
   git push origin main
   ```
4. GitHub Pages will automatically rebuild and deploy

## Troubleshooting

### Site Not Loading
- Make sure you're using the correct URL
- Check that GitHub Pages is enabled in settings
- Verify the branch and folder settings

### Questions Not Loading
- Ensure your CSV/JSON file is properly formatted
- Check the browser console for errors (F12 > Console)

### Admin Password Not Working
- Verify you're using the correct password (default: `bbcadmin2026`)
- Check that localStorage is enabled in the browser

### Real-time Sync Issues
- The platform uses localStorage for sync
- Make sure participants are on the same browser type (Chrome, Firefox, etc.)
- For best results, use the admin account on a computer connected to a projector

## Performance Tips

1. **Optimize Images**: If you add images, compress them first
2. **Limit Questions**: For best performance, keep under 200 questions
3. **Test Before Event**: Always test with a few participants first
4. **Stable Internet**: Ensure reliable internet connectivity

## Security Notes

- **Change the default admin password** before your event
- The platform stores data in browser localStorage - it's not encrypted
- Use HTTPS (GitHub Pages provides this automatically)
- Don't include sensitive information in questions

## Support

If you encounter issues:
1. Check this README and the main README.md
2. Review browser console for error messages
3. Open an issue on GitHub if needed

---

**Happy Quizzing!** 🎉

*Built for Oasis of Wisdom Bible Church and the global Christian community.*
