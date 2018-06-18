/**
 * Our custom rule to check if `hasPHI` class variable set for each model
 *
 * NOTE: Recompile this after editing it
 *      cd rules
 *      tsc checkModelVariableRule.ts
 */

import Lint from 'tslint';

export class Rule extends Lint.Rules.AbstractRule {
  public static FAILURE_STRING = 'must define static boolean class variable "hasPHI"';
  public apply(sourceFile: any): Lint.RuleFailure[] {
    return this.applyWithWalker(new CheckModelVariable(sourceFile, this.getOptions()));
  }
}

/* tslint:disable */
// The walker takes care of all the work.
class CheckModelVariable extends Lint.RuleWalker {
  public visitClassDeclaration(node: any) {
    const filePath = node.getSourceFile().fileName;

    if (filePath.indexOf('/models/') > -1 &&
      filePath.indexOf('/models/__tests__') <= -1
    ) {
      const text = node.getText();

      if (text.indexOf('hasPHI') < 0) {
        this.addFailure(
          this.createFailure(node.getStart(), node.getWidth(), Rule.FAILURE_STRING),
        );
      }

      // call the base version of this visitor to actually parse this node
      super.visitClassDeclaration(node);

    }
  }
}
/* tslint:enable */
