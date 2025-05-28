# everything

This is my **shared codebase** for reusable UI components, hooks, and libraries across multiple React and Next.js projects.

It's just ShadCN with my own components, utilities and whatnnot.

It’s not a package, not a framework, and definitely not a library anyone should install.

Just **my own central source of truth**, wired into projects using **hard links** to avoid duplication or broken imports.

---

## Why This Exists

Managing shared code across multiple React and Next.js projects is notoriously frustrating. Common issues include:

- ** Symlink Headaches**
  Tools like `npm link` or `yarn link` often break module resolution in Next.js, lead to duplicated React versions, and confuse TypeScript and Webpack.

- ** Dependency Hell**
  `npm install` frequently explodes with peer dependency conflicts, especially when mixing versions of React, Next.js, or other libraries (I'm sure you know a good handful)

- ** Version Drift**
  Trying to keep packages versioned, published, and synced across multiple apps just to reuse a few components is overkill — and easy to mess up.

## What's Inside

A bunch of components, hooks, utilities and pages that all work together to streamline creating a new project.

It's ShadCN, if anything, go use ShadCN instead of using this.

## Usage

To pull shared components, hooks, and libraries into a project, use the `add:everything` script.

This will:

- Prompt you for the path to place `components.json` (default: `./components.json`)
- Prompt you for the destination folder for the shared code (default: `./src`)
- Hard-link all files from `src/components`, `src/hooks`, and `src/lib` in this repo into the destination folder
- Create a hard link to the central `components.json`

### Setup

Make sure you have `bun` installed in the consuming project.

Then add the following script to your `package.json`:

```json
"scripts": {
  "add:everything": "bun run node_modules/@davidcks/everything/everything.ts"
}
```

Then run

```bash
bun run add:everything
```

This command assumes your project has access to this repo via node_modules (for example, if it's symlinked locally or installed as a local package).

### Example output

```bash
bun run add:everything

Where should components.json go? [default: ./components.json]:
Where should the folders (components/hooks/lib) go? [default: ./src]:

Hard linked: ./src/components/Button.tsx -> .../everything/src/components/Button.tsx
Hard linked: ./components.json -> .../everything/components.json
```

## License

This project is licensed under the MIT License.

You are free to use, copy, modify, and distribute the code in this repository, privately or publicly, with or without modification, as long as the original license and copyright
notice are included.

See the [LICENSE](./LICENSE) file for full details.
