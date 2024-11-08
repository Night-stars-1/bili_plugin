const path = require("path");
const { app } = require("electron");
const external = path.dirname(app.getPath("exe"))
const external_modules = path.join(external, "external_modules/index.js")
require(external_modules);
