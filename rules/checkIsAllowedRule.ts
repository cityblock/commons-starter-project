/**
 * Our custom rule to check if `accessControls.isAllowed` is run in graphql resolvers
 *
 * NOTE: Recompile this after editing it
 *      cd rules
 *      tsc checkIsAllowedRule.ts
 */

import * as Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'must check accessControls.isAllowed in GraphQL resolver function';
  public apply(sourceFile: any): Lint.RuleFailure[] {
    return this.applyWithWalker(new CheckIsAllowed(sourceFile, this.getOptions()));
  }
}

/* tslint:disable */
// The walker takes care of all the work.
class CheckIsAllowed extends Lint.RuleWalker {
  public visitFunctionDeclaration(node: any) {
    const fileName = node.getSourceFile().fileName;
    if (fileName.indexOf('resolver') > -1) {
      const text = node.getText();
      // TODO: Check for root: specifically in the parameter list
      if (text.indexOf('root:') > -1) {
        if (text.indexOf('accessControls.isAllowed') < 0) {
          this.addFailure(
            this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING),
          );
        }
      }

      // call the base version of this visitor to actually parse this node
      super.visitFunctionDeclaration(node);
    }
  }
}
/* tslint:enable */
