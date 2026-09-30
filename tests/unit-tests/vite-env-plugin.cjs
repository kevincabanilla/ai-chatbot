module.exports = function viteEnvPlugin({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        const object = path.node.object;
        if (
          object.type === "MetaProperty" &&
          object.meta.name === "import" &&
          object.property.name === "meta" &&
          path.node.property.type === "Identifier" &&
          path.node.property.name === "env"
        ) {
          path.replaceWith(
            t.memberExpression(t.identifier("process"), t.identifier("env")),
          );
        }
      },
    },
  };
};
