import type { ValidationAcceptor, ValidationChecks } from 'langium';
import { isDocmlRecord, type DocmlAstType, type DocmlNode } from './generated/ast.js';
import type { DocmlServices } from './docml-module.js';

/**
 * Register custom validation checks.
 * @param services The Docml services
 */
export function registerValidationChecks(services: DocmlServices) {
  const registry = services.validation.ValidationRegistry;
  const validator = services.validation.DocmlValidator;
  const checks: ValidationChecks<DocmlAstType> = {
    DocmlNode: validator.checkNodeNameDoesNotContainEmptyScopes,
  };
  registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class DocmlValidator {
  checkNodeNameDoesNotContainEmptyScopes(node: DocmlNode, accept: ValidationAcceptor): void {
    if (isDocmlRecord(node)) {
      const scopes = node.name.split(':').slice(1, -1);
      if (scopes.includes('')) {
        accept('warning', 'Scope name should not be empty.', { node, property: 'name' });
      }
    }
  }
}
