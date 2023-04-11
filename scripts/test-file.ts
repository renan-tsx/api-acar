import { spawn } from 'child_process';

const args = process.argv.slice(2);

const testFile = args[0];

if (!testFile) {
  console.error('Por favor, informe o nome do arquivo de teste.');
  process.exit(1);
}

const find = spawn('find', ['./src', '-name', testFile, '-type', 'f']);

find.stdout.on('data', (data: Buffer) => {
  const testFilePath = data.toString().trim();

  if (testFilePath) {
    const test = spawn('yarn', ['test', testFilePath, '--color', '--detectOpenHandles', '--forceExit']);

    test.stdout.pipe(process.stdout);
    test.stderr.pipe(process.stderr);
  } else {
    console.error(`Arquivo de teste ${testFile} não encontrado.`);
    process.exit(1);
  }
});

find.stderr.on('data', (data: Buffer) => {
  console.error(`Erro ao procurar arquivo de teste: ${data.toString()}`);
  process.exit(1);
});
