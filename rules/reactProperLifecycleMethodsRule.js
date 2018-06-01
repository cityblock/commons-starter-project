"use strict";
/**
 * react-proper-lifecycle-methods
 *
 * This custom tslint rule is attempts to prevent erroneous usage of the React
 * lifecycle methods by ensuring proper method naming, and parameter order,
 * types and names.
 *
 * source: https://github.com/desktop/desktop/blob/master/tslint-rules/reactProperLifecycleMethodsRule.ts
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
var ts = require("typescript");
var ReactProperLifecycleMethodsWalker = /** @class */ (function (_super) {
    __extends(ReactProperLifecycleMethodsWalker, _super);
    function ReactProperLifecycleMethodsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ReactProperLifecycleMethodsWalker.prototype.visitClassDeclaration = function (node) {
        if (node.heritageClauses && node.heritageClauses.length) {
            for (var _i = 0, _a = node.heritageClauses; _i < _a.length; _i++) {
                var heritageClause = _a[_i];
                if (heritageClause.token === ts.SyntaxKind.ExtendsKeyword && heritageClause.types) {
                    for (var _b = 0, _c = heritageClause.types; _b < _c.length; _b++) {
                        var type = _c[_b];
                        var inheritedName = type.expression.getText();
                        if (inheritedName === 'React.Component') {
                            if (type.typeArguments && type.typeArguments.length === 2) {
                                this.propsTypeName = type.typeArguments[0].getText();
                                this.stateTypeName = type.typeArguments[1].getText();
                                _super.prototype.visitClassDeclaration.call(this, node);
                                return;
                            }
                        }
                    }
                }
            }
        }
    };
    ReactProperLifecycleMethodsWalker.prototype.visitMethodDeclaration = function (node) {
        var methodName = node.name.getText();
        if (methodName.startsWith('component') || methodName.startsWith('shouldComponent')) {
            switch (methodName) {
                case 'componentWillMount':
                case 'componentDidMount':
                case 'componentWillUnmount':
                    return this.verifyEmptyParameters(node);
                case 'componentWillReceiveProps':
                    return this.verifyComponentWillReceiveProps(node);
                case 'componentWillUpdate':
                    return this.verifycomponentDidUpdate(node);
                case 'componentDidUpdate':
                    return this.verifyComponentDidUpdate(node);
                case 'shouldComponentUpdate':
                    return this.verifyShouldComponentUpdate(node);
                default:
                    return this.reservedNameError(node);
            }
        }
    };
    ReactProperLifecycleMethodsWalker.prototype.verifyEmptyParameters = function (node) {
        if (node.parameters.length) {
            var start = node.getStart();
            var width = node.getWidth();
            var methodName = node.name.getText();
            var message = methodName + " should not accept any parameters.";
            this.addFailure(this.createFailure(start, width, message));
        }
    };
    ReactProperLifecycleMethodsWalker.prototype.verifyParameter = function (node, expectedParameter) {
        var parameterName = node.name.getText();
        var parameterStart = node.getStart();
        var parameterWidth = node.getWidth();
        if (parameterName !== expectedParameter.name) {
            var message = "parameter should be named " + expectedParameter.name + ".";
            this.addFailure(this.createFailure(parameterStart, parameterWidth, message));
            return false;
        }
        var parameterTypeName = node.type ? node.type.getText() : undefined;
        if (parameterTypeName !== expectedParameter.type) {
            var message = "parameter should be of type " + expectedParameter.type + ".";
            this.addFailure(this.createFailure(parameterStart, parameterWidth, message));
            return false;
        }
        return true;
    };
    ReactProperLifecycleMethodsWalker.prototype.verifyParameters = function (node, expectedParameters) {
        // It's okay to omit parameters
        for (var i = 0; i < node.parameters.length; i++) {
            var parameter = node.parameters[i];
            if (i >= expectedParameters.length) {
                var parameterName = parameter.getText();
                var parameterStart = parameter.getStart();
                var parameterWidth = parameter.getWidth();
                var message = "unknown parameter " + parameterName;
                this.addFailure(this.createFailure(parameterStart, parameterWidth, message));
                return false;
            }
            if (!this.verifyParameter(parameter, expectedParameters[i])) {
                return false;
            }
        }
        // Remove trailing unused void parameters
        for (var i = node.parameters.length - 1; i >= 0; i--) {
            var parameter = node.parameters[i];
            var parameterTypeName = parameter.type ? parameter.type.getText() : undefined;
            if (parameterTypeName === 'void') {
                var parameterName = parameter.getText();
                var parameterStart = parameter.getStart();
                var parameterWidth = parameter.getWidth();
                var message = "remove unused void parameter " + parameterName + ".";
                this.addFailure(this.createFailure(parameterStart, parameterWidth, message));
                return false;
            }
            else {
                break;
            }
        }
        return true;
    };
    ReactProperLifecycleMethodsWalker.prototype.verifyComponentWillReceiveProps = function (node) {
        this.verifyParameters(node, [{ name: 'nextProps', type: this.propsTypeName }]);
    };
    ReactProperLifecycleMethodsWalker.prototype.verifyComponentWillUpdate = function (node) {
        this.verifyParameters(node, [
            { name: 'nextProps', type: this.propsTypeName },
            { name: 'nextState', type: this.stateTypeName },
        ]);
    };
    ReactProperLifecycleMethodsWalker.prototype.verifyComponentDidUpdate = function (node) {
        this.verifyParameters(node, [
            { name: 'prevProps', type: this.propsTypeName },
            { name: 'prevState', type: this.stateTypeName },
        ]);
    };
    ReactProperLifecycleMethodsWalker.prototype.verifyShouldComponentUpdate = function (node) {
        this.verifyParameters(node, [
            { name: 'nextProps', type: this.propsTypeName },
            { name: 'nextState', type: this.stateTypeName },
        ]);
    };
    ReactProperLifecycleMethodsWalker.prototype.reservedNameError = function (node) {
        var start = node.name.getStart();
        var width = node.name.getWidth();
        var message = 'Method names starting with component or shouldComponent ' +
            'are prohibited since they can be confused with React lifecycle methods.';
        this.addFailure(this.createFailure(start, width, message));
    };
    return ReactProperLifecycleMethodsWalker;
}(Lint.RuleWalker));
/* tslint:disable */
var Rule = /** @class */ (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        if (sourceFile.languageVariant === ts.LanguageVariant.JSX) {
            return this.applyWithWalker(new ReactProperLifecycleMethodsWalker(sourceFile, this.getOptions()));
        }
        else {
            return [];
        }
    };
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
/* tslint:enable */
