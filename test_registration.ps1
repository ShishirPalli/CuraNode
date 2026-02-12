$email = "testdoc_$(Get-Random)@hospital.com"
$testUser = @{
  firstName = 'TestDoctor'
  lastName = 'Verified'
  email = $email
  password = 'password123'
  role = 'doctor'
  department = 'Orthopedics'
} | ConvertTo-Json

Write-Host "===== TESTING REGISTRATION FLOW =====" -ForegroundColor Cyan
Write-Host "`n1. Registering new user: $email"
$regResp = Invoke-RestMethod -Uri 'http://localhost:5000/api/auth/register' -Method Post -Headers @{'Content-Type'='application/json'} -Body $testUser
$token = $regResp.token
Write-Host "✓ Registration successful"
Write-Host "✓ User: $($regResp.user.firstName) $($regResp.user.lastName)"
Write-Host "✓ Token received: $($token.Substring(0,25))..."

Write-Host "`n2. Creating a patient record with token"
$patientBody = @{
  medicalRecordNumber = "MRN-$(Get-Random 100000)"
  firstName = 'PatientTest'
  lastName = 'Record'
  dateOfBirth = '1980-06-20'
  gender = 'M'
  bloodType = 'B+'
} | ConvertTo-Json

try {
  $patResp = Invoke-RestMethod -Uri 'http://localhost:5000/api/patients' -Method Post -Headers @{'Content-Type'='application/json'; 'Authorization' = "Bearer $token"} -Body $patientBody
  Write-Host "✓ Patient created successfully"
  Write-Host "✓ Patient: $($patResp.firstName) $($patResp.lastName)"
} catch {
  $resp = $_.Exception.Response
  $reader = New-Object System.IO.StreamReader($resp.GetResponseStream())
  $error = $reader.ReadToEnd() | ConvertFrom-Json
  Write-Host "✗ ERROR: $($error.message)" -ForegroundColor Red
}

Write-Host "`n3. Fetching patients list with same token"
try {
  $patsResp = Invoke-RestMethod -Uri 'http://localhost:5000/api/patients' -Method Get -Headers @{'Authorization' = "Bearer $token"}
  Write-Host "✓ Patients fetched successfully"
  Write-Host "✓ Total patients for user: $($patsResp.Count)"
} catch {
  Write-Host "✗ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n===== TEST COMPLETE =====" -ForegroundColor Green
