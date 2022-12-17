'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const plur = require('plur');
const logSymbols = require('log-symbols');
const { codeFrameColumns } = require('@babel/code-frame');

module.exports = function(results) {
	if (!results || !results.length) return '';

	let errorCount = 0;
	let warningCount = 0;
	let invalidOptionWarningCount = 0;

	const filesOutput = results.map(function(result, resultIndex) {

		let returnData = '';

		// Collecting Stylelint configuration warnings (we need it only once, but they are listed in the file-level, this is why we are checking resultIndex)
		if (resultIndex === 0) {
			const invalidOptionWarningsOutput = result.invalidOptionWarnings.map(function(invalidOptionWarning) {
				invalidOptionWarningCount++;

				return [`  ${logSymbols.error} ${invalidOptionWarning.text}`].join('\n')
			});

			if (invalidOptionWarningsOutput.length) returnData += `  ${chalk.underline('Configuration ' + plur('warning', invalidOptionWarningCount))}\n\n${invalidOptionWarningsOutput.join('\n')}\n\n`;
		}

		// Collecting Stylesheet errors
		const fileContent = fs.readFileSync(result.source, 'utf8');
		const filename = chalk.underline(path.relative('.', result.source))

		const messagesOutput = result.warnings.map(function(warning) {
			const warningRuleInParentheses = `(${warning.rule})`
			// warning.rule is appended to warning.text (wrapped in parentheses). We remove it in case we need them separately.
			let ruleText = warning.text.substring(0, warning.text.indexOf(warningRuleInParentheses))
			const isError = warning.severity === 'error'
			const shouldOmitRuleId = isError && warning.text.endsWith(warningRuleInParentheses)
			const ruleId = shouldOmitRuleId ? '' : chalk.dim(warningRuleInParentheses)

			let symbol;
			if (warning.severity === 'warning') {
				symbol = logSymbols.warning;
				warningCount++
			} else if (warning.severity === 'error') {
				symbol = logSymbols.error;
				errorCount++
				ruleText = chalk.red(warning.text)
			}

			const location = {
				start: {
					column: warning.column,
					line: warning.line
				}
			};

			const shouldAddEndLocation =
				typeof warning.endColumn === 'number' && typeof warning.endLine === 'number' && warning.endLine >= warning.line
			if (shouldAddEndLocation) {
				location.end = {
					column: warning.endColumn,
					line: warning.endLine
				};
			}
			const messageHeaderText = [
				symbol,
				ruleText,
				ruleId,
				'at',
				`${filename}:${warning.line}:${warning.column}`
			].filter(Boolean).join(' ')

			return [
				`  ${messageHeaderText}`,
				`${codeFrameColumns(fileContent, location, { highlightCode: true })}` // TODO disable syntax error highlighting
			].join('\n')
		});

		if (messagesOutput.length) returnData += `  ${filename}\n\n${messagesOutput.join('\n\n')}`;

		return returnData;
	});

	let finalOutput = `${filesOutput.filter(s => s).join('\n\n\n')}\n\n`;

	if (invalidOptionWarningCount > 0) {
		finalOutput += `  ${chalk.blue(`${invalidOptionWarningCount} configuration ${plur('warning', invalidOptionWarningCount)}`)}\n`
	}

	if (errorCount > 0) {
		finalOutput += `  ${chalk.red(`${errorCount} ${plur('error', errorCount)}`)}\n`
	}

	if (warningCount > 0) {
		finalOutput += `  ${chalk.yellow(`${warningCount} ${plur('warning', warningCount)}`)}\n`
	}

	return (errorCount + warningCount) > 0 ? finalOutput : ''
};
