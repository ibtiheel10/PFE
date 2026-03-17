const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'ai', 'ai.service.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Fix localhost to 127.0.0.1
content = content.replace("http://localhost:11434/api/generate", "http://127.0.0.1:11434/api/generate");

// 2. Fix prompt block in generateTextQuestions
const oldPromptMarkerStart = '    const avoidPart =';
const oldPromptMarkerEnd = "      '}';";
const startIdx = content.indexOf(oldPromptMarkerStart);
const endIdx = content.indexOf(oldPromptMarkerEnd);

if (startIdx !== -1 && endIdx !== -1) {
    const newPromptBlock = `    const avoidPart =
      previousQuestions.length > 0
        ? '\\nDo NOT repeat these questions:\\n' +
          previousQuestions.map((q, i) => (i + 1) + '. ' + q).join('\\n')
        : '';

    const prompt =
      'Generate exactly ' + count + ' multiple choice questions for a job interview.\\n' +
      'Each question must have exactly 4 options and 1 correct answer.\\n' +
      'Return ONLY valid JSON with no extra text or markdown.\\n\\n' +
      'Job Description:\\n' + jobDescription.substring(0, 800) +
      avoidPart +
      '\\n\\nRequired JSON format:\\n' +
      '{"questions":[{"question":"...","options":["option1","option2","option3","option4"],"correctAnswer":"option1"}]}';`;

    content = content.substring(0, startIdx) + newPromptBlock + content.substring(endIdx + oldPromptMarkerEnd.length);
}

// 3. Fix parseJsonQuestion (remove isTechnology, lower limit to 2 options)
const oldFnMatch = content.match(/private parseJsonQuestion\(raw: any, index: number\): QuizQuestion \| null \{[\s\S]*?\n  \}/);
if (oldFnMatch) {
    const newFn = `private parseJsonQuestion(raw: any, index: number): QuizQuestion | null {
    if (!raw || !raw.question || !Array.isArray(raw.options) || !raw.correctAnswer) {
      this.logger.warn(\`Question ignored at index \${index}: invalid JSON.\`);
      return null;
    }

    const seen = new Set<string>();
    const filtered: string[] = [];

    for (const opt of raw.options) {
      if (typeof opt !== 'string') continue;
      const cleaned = opt.replace(/^[A-Da-d][).\\s]+/, '').trim();
      if (cleaned.length < 2) continue;              // skip empty strings only
      if (seen.has(cleaned.toLowerCase())) continue;  // skip duplicates
      filtered.push(cleaned);
      seen.add(cleaned.toLowerCase());
      if (filtered.length === 4) break;
    }

    if (filtered.length < 2) {
      this.logger.warn(\`Question "\${raw.question.substring(0, 30)}..." ignored: less than 2 options (\${filtered.length} found).\`);
      return null;
    }

    // Pad to 4 options if needed
    while (filtered.length < 4) filtered.push('N/A');

    const rawCorrect = raw.correctAnswer.replace(/^[A-Da-d][).\\s]+/, '').trim();
    const correctMatch = filtered.find(opt => opt.toLowerCase() === rawCorrect.toLowerCase());

    return {
      id: index + 1,
      question: raw.question.trim(),
      options: filtered.slice(0, 4),
      correctAnswer: correctMatch ? correctMatch : filtered[0],
      isCorrectVerified: false
    };
  }`;
    content = content.replace(oldFnMatch[0], newFn);
}

// 4. Change count 4 to 2
content = content.replace("'Generating 4 questions with text parsing'", "'Generating 2 questions with text parsing'");
content = content.replace("this.generateTextQuestions(jobDescription, 4)", "this.generateTextQuestions(jobDescription, 2)");

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done! All fixes reapplied successfully.');
