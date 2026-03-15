# PowerShell script to deploy to Vercel with automated responses
$vercelPath = (Get-Command vercel).Source

# Start Vercel process
$psi = New-Object System.Diagnostics.ProcessStartInfo
$psi.FileName = "vercel"
$psi.Arguments = ""
$psi.UseShellExecute = $false
$psi.RedirectStandardInput = $true
$psi.RedirectStandardOutput = $true
$psi.WorkingDirectory = "E:\FlintEatsClient"

$process = [System.Diagnostics.Process]::Start($psi)

# Wait for first prompt and respond
Start-Sleep -Milliseconds 500
$process.StandardInput.WriteLine("Y")

# Wait for second prompt (Link to existing project) and respond
Start-Sleep -Milliseconds 500
$process.StandardInput.WriteLine("N")

# Wait for third prompt (Project name) and respond
Start-Sleep -Milliseconds 500
$process.StandardInput.WriteLine("flinteats")

# Read output
$output = $process.StandardOutput.ReadToEnd()
Write-Host $output

$process.WaitForExit()
