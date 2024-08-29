# Npm linking of local packages

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
