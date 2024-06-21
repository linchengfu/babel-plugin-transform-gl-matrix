module.exports = function ({ types: t }) {
  // plugin contents

  return {
    visitor: {
      CallExpression: {
        exit(path) {
          const funcName = path.node.callee.name;
          if (funcName === 'vec2') {
            const args = path.node.arguments;
            if (args.length === 2) {
              path.node.callee.name = 'vec2.fromValues';
            }
          }
        },
      },
      UnaryExpression: {
        exit(path) {
          const { operator, argument } = path.node;
          if (operator === '-') {
            if (t.isCallExpression(argument) && argument.callee.name === 'vec2') {
              const node = t.callExpression(
                t.identifier(`${argument.callee.name}.negate`),
                [
                  t.callExpression(
                    t.identifier(`${argument.callee.name}.create`),
                    [],
                  ),
                  argument.arguments[0]],
              );
              path.replaceWith(node);
            }
          }
        },
      },
      BinaryExpression: {
        exit(path) {
          const { left, right } = path.node;
          if (t.isCallExpression(left) && left.callee.name === 'vec2') {
            if (t.isCallExpression(right) && right.callee.name === 'vec2') {
              const { operator } = path.node;
              if (operator === '+') {
                // https://babeljs.io/docs/en/babel-types
                const node = t.callExpression(
                  t.identifier(`${left.callee.name}.add`),
                  [
                    t.callExpression(
                      t.identifier(`${left.callee.name}.create`),
                      [],
                    ),
                    left.arguments[0],
                    right.arguments[0]],
                );
                path.replaceWith(node);
              }
            } else if (t.isNumericLiteral(right)) {
              const { operator } = path.node;
              if (operator === '+') {
                // https://babeljs.io/docs/en/babel-types
                const node = t.callExpression(
                  t.identifier(`${left.callee.name}.add`),
                  [
                    t.callExpression(
                      t.identifier(`${left.callee.name}.create`),
                      [],
                    ),
                    left.arguments[0],
                    t.callExpression(
                      t.identifier(`${left.callee.name}.fromValues`),
                      [right, t.numericLiteral(0)],
                    )],
                );
                path.replaceWith(node);
              }
            } else {
              // console.log(right);
            }
          } else if (t.isCallExpression(left) && left.callee.name === 'vec2.add') {
            console.log(left, right)
            if (t.isCallExpression(right) && right.callee.name === 'vec2') {
              const { operator } = path.node;
              if (operator === '+') {
                // https://babeljs.io/docs/en/babel-types
                const node = t.callExpression(
                  t.identifier(left.callee.name),
                  [
                    t.callExpression(
                      t.identifier(`${right.callee.name}.create`),
                      [],
                    ),
                    left,
                    right.arguments[0]],
                );
                path.replaceWith(node);
              }
            }
          } else if (t.isNumericLiteral(left) && t.isCallExpression(right) && right.callee.name === 'vec2') {
            const { operator } = path.node;
            if (operator === '+') {
              // https://babeljs.io/docs/en/babel-types
              const node = t.callExpression(
                t.identifier(`${right.callee.name}.add`),
                [
                  t.callExpression(
                    t.identifier(`${right.callee.name}.create`),
                    [],
                  ),
                  t.callExpression(
                    t.identifier(`${right.callee.name}.fromValues`),
                    [left, t.numericLiteral(0)],
                  ),
                  right.arguments[0],
                ],
              );
              path.replaceWith(node);
            }
          }
        },
      },
    },
  };
};
