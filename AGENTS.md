## Page Structure

For each page, we adhere to the following folder structure:

- A `page` folder which contains:
  - `index.tsx`: The React component of the page.
  - `.module.scss`: The CSS module for styling the component.

This structure ensures a consistent and organized approach to building our application's interface. Each page's style and functionality are encapsulated, making the components easily maintainable and scalable.

**Sass Breakpoints**

- Use the global Sass module at `src/globals.module.scss` to access responsive helpers.
- Import it in SCSS files with: `@use "../globals.module" as g;` (adjust path as needed).
- Use `@include g.up(md) { ... }` for styles that apply at and above the `md` breakpoint.
- Use `@include g.down(md) { ... }` for styles that apply below the `md` breakpoint.
 

Example:

```
.footer {
  background: #f8fafc; // mobile

  @include g.up(md) {
    background: #eef6ff; // desktop and up
  }
}
```

Example `g.down`:

```
.nav {
  background: white;

  @include g.down(md) {
    background: #f8fafc; // mobile and smaller than md
  }
}
```