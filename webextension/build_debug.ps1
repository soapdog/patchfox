$t = Measure-Command {cross-env ELM_DEBUGGER=true npm run build}

$msg = [string]::Format("Built new version in {0} seconds", $t.TotalSeconds )

npx -p node-notifier-cli notify -t 'Patchfox' -m $msg

