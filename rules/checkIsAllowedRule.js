"use strict";
/**
 * Our custom rule to check if `checkUserPermissions` is run in graphql resolvers
 *
 * NOTE: Recompile this after editing it
 *      cd rules
 *      tsc checkIsAllowedRule.ts
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var Lint = require("tslint");
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new CheckIsAllowed(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'must call check user permissions in GraphQL resolver function';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
/* tslint:disable */
// The walker takes care of all the work.
var CheckIsAllowed = /** @class */ (function (_super) {
    __extends(CheckIsAllowed, _super);
    function CheckIsAllowed() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckIsAllowed.prototype.visitFunctionDeclaration = function (node) {
        var fileName = node.getSourceFile().fileName;
        if (fileName.indexOf('resolver') > -1) {
            var text = node.getText();
            // TODO: Check for root: specifically in the parameter list
            if (text.indexOf('root:') > -1) {
                if (text.indexOf('checkUserPermissions') < 0) {
                    this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
                }
            }
            // call the base version of this visitor to actually parse this node
            _super.prototype.visitFunctionDeclaration.call(this, node);
        }
    };
    return CheckIsAllowed;
}(Lint.RuleWalker));
/* tslint:enable */
