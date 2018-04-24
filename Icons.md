### Adding an icon
1. `cd app/`
2. `meteor add partup-iconfont-generator` (requires an update)
3. Add the new icon SVG to the */client/icons* folder, **dot not use this folder for anything else than the iconfont icons**
4. Name the icon svg file properly (upload icon should be named `upload.svg`, not `icon_upload.svg`, don't use a prefix like `icon_` for consistency)
5. Wait for `[iconfont] generating`
6. In */client/stylesheets/font-faces* a new `_picons.sass` is generated, NOTE: `_picons.sass` cannot be used to change icon styles, do this in */client/stylesheets/components/pu-icons.sass*
7. check in **all** supported browsers if icons still work, **especially IE**
8. `meteor remove partup-iconfont-generator`
9. You now have a new icon added to the project *cheers*. Push the icon file changes to your current branch.