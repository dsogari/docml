import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { isRecord, type DocmlAstType, type Node } from './generated/ast.js';
import type { DocmlServices } from './docml-module.js';

/**
 * Register custom validation checks.
 * @param services The Docml services
 */
export function registerValidationChecks(services: DocmlServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.DocmlValidator;
  const checks: ValidationChecks<DocmlAstType> = {
    Node: validator.checkNodeNameDoesNotContainEmptyScopes,
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DocmlValidator {
  checkNodeNameDoesNotContainEmptyScopes(node: Node, accept: ValidationAcceptor): void {
    if (isRecord(node)) {
      const scopes = node.name.split(':').slice(1, -1);
      if (scopes.includes('')) {
        accept('warning', 'Scope name should not be empty.', { node, property: 'name' });
      }
    }
  }
}
