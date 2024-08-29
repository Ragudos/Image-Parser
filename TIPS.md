# Development Tips

Some tips that I want to remember, so I don't have to keep researching.

## Npm linking of local packages

**Legend**:

-   package1: The dependency
-   package2: The package using package1.

**Methods**:

-   Two steps

```bash
cd package1
npm link
cd ../package2
npm link package1
```

-   One step

```bash
cd package2
npm link ../package1
```

Then do on package2:

```bash
npm install "@monorepo_name/package1" --package-lock-only
```
## Switching and deploying to different branches

1. Check current branch (The branch you're in will have a leading asterisk)

```bash
git branch
```
2. Go to another branch

```bash
git checkout -b <branch-name>
```

or, if the branch exists

```bash
git checkout <branch-name>
```

3. Check commit status

```bash
git status
```

This will show files to be committed or currently staged.

4. Add files to be committed/staged

```bash
git add <files>
```

if adding everything in current directory

```bash
git add .
```

5. Commit

```bash
git commit -m "<message>"
```

6. Push

```bash
git push --set-upstream origin <branch-name>
```

7. Go back if needed

```bash
git checkout master
```

**Note**: When changing branches, firstly do step 6 everytime. After that, the command `git push` can be safely done.
