# Get your site on GitHub Pages (simple steps)

Do these in order in a terminal, from the project folder `D:\Static Selector`.

---

## Step 1: Create the repo on GitHub and push your code

Run this one command (you can change `Static-Selector` to another name if you want):

```powershell
gh repo create Static-Selector --public --source=. --remote=origin --push
```

If it says you're not logged in, run this first, then try again:

```powershell
gh auth login
```

Pick **GitHub.com**, then sign in (browser or paste a token).

---

## Step 2: Turn on GitHub Pages

Run:

```powershell
npm run enable-pages
```

That turns on Pages for your repo. You should see a message with your site URL.

---

## Step 3: Open your site

Wait about 1–2 minutes, then open this in your browser (replace `YOUR-USERNAME` with your GitHub username):

**https://YOUR-USERNAME.github.io/Static-Selector/**

Example: if your username is `jane`, the link is  
**https://jane.github.io/Static-Selector/**

---

## If something goes wrong

- **"no git remotes found"**  
  Do Step 1 first so the repo exists on GitHub.

- **"Bad credentials" or "401"**  
  GitHub doesn’t recognize you. Run `gh auth login`, sign in, then run the command again.

- **"GitHub Pages is already enabled"**  
  Nothing to do — your site should already be at the URL above.
