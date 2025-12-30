"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var post_router_1 = require("./modules/post/post.router");
var app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/posts", post_router_1.postRouter);
app.get("/", function (req, res) {
    res.send("Hello World");
});
exports.default = app;
