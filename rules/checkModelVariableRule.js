"use strict";
/**
 * Our custom rule to check if `hasPHI` class variable set for each model
 *
 * NOTE: Recompile this after editing it
 *      cd rules
 *      tsc checkModelVariableRule.ts
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
        return this.applyWithWalker(new CheckModelVariable(sourceFile, this.getOptions()));
    };
    Rule.FAILURE_STRING = 'must define static boolean class variable "hasPHI"';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
/* tslint:disable */
// The walker takes care of all the work.
var CheckModelVariable = /** @class */ (function (_super) {
    __extends(CheckModelVariable, _super);
    function CheckModelVariable() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CheckModelVariable.prototype.visitClassDeclaration = function (node) {
        var filePath = node.getSourceFile().fileName;
        if (filePath.indexOf('/models/') > -1 &&
            filePath.indexOf('/models/__tests__') <= -1) {
            var text = node.getText();
            if (text.indexOf('hasPHI') < 0) {
                this.addFailure(this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING));
            }
            // call the base version of this visitor to actually parse this node
            _super.prototype.visitClassDeclaration.call(this, node);
        }
    };
    return CheckModelVariable;
}(Lint.RuleWalker));
/* tslint:enable */
