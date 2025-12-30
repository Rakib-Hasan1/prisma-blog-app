"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postRouter = void 0;
var express_1 = require("express");
var router = express_1.default.Router();
router.post("/", function (req, res) {
    res.send("Create a new post");
});
exports.postRouter = router;
