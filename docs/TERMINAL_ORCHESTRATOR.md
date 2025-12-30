## Terminal Orchestrator (osascript)

Скрипт автоматизирует рабочий цикл:
**Открыть терминал → отправить команду → ждать завершения → прочитать результат → проанализировать → действовать**.

Реализация: Node.js + `osascript`.

### Что делает

- **Открывает новый терминал** (по умолчанию `Terminal.app`)
- **Запускает команду**
- **Пишет вывод в log-файл**
- **Ставит BEGIN/END маркеры** и по ним детектит завершение + exit code
- **Возвращает структурированный JSON** (`status`, `exitCode`, `output`, `analysis`, `logFile`)

### Требования

- macOS
- Node.js 18+
- Для режима `cursor` может потребоваться разрешение macOS на **Accessibility** (UI scripting).

### Быстрый старт (Terminal.app, рекомендуемый)

```bash
node scripts/terminal-orchestrator.js --engine terminalapp --command "echo hello"
```

Пример ответа (сокращённо):

```json
{
  "status": "success",
  "exitCode": 0,
  "output": "hello",
  "logFile": "/abs/path/.cursor/terminal-orchestrator/<runId>.log"
}
```

### Ошибки и таймауты

- `status=error`: ненулевой exit code **или** найден error‑паттерн в выводе.
- `status=timeout`: END‑маркер не найден за `--timeoutSec`.

### Полезные опции

- `--timeoutSec 600`: увеличить таймаут
- `--pollMs 200`: частота чтения log-файла
- `--logDir /abs/path`: куда складывать логи (по умолчанию `<workspace>/.cursor/terminal-orchestrator`)
- `--logFile /abs/path/file.log`: явный файл лога
- `--new-window`: попытаться открыть команду в новом окне Terminal.app (best-effort)
- `--dryRun`: вывести wrapped‑команду и параметры без запуска

### Конфиг

Настройки (таймауты/паттерны) вынесены в:
`scripts/terminal-orchestrator-config.js`

### Режим cursor (экспериментальный)

Есть `--engine cursor`, но надёжность зависит от того, пишет ли Cursor вывод интегрированного терминала в `.cursor/.../terminals/*.txt` в вашей версии/настройках.

