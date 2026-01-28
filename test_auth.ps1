# Test Authentication Flow
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Testing WeatherFish Authentication" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Login
Write-Host "Step 1: Logging in as 'testuser'..." -ForegroundColor Yellow
$loginBody = @{
    username_or_email = 'testuser'
    password = 'testpass123'
} | ConvertTo-Json

try {
    $loginResponse = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/auth/login' -Method POST -ContentType 'application/json' -Body $loginBody
    $loginData = $loginResponse.Content | ConvertFrom-Json
    $token = $loginData.access_token
    Write-Host "✓ Login successful!" -ForegroundColor Green
    Write-Host "  Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Login failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Step 2: Get current user
Write-Host "Step 2: Fetching user profile with token..." -ForegroundColor Yellow
try {
    $headers = @{
        Authorization = "Bearer $token"
    }
    $userResponse = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/auth/me' -Headers $headers
    $userData = $userResponse.Content | ConvertFrom-Json
    Write-Host "✓ Profile fetched successfully!" -ForegroundColor Green
    Write-Host "  ID: $($userData.id)" -ForegroundColor Gray
    Write-Host "  Username: $($userData.username)" -ForegroundColor Gray
    Write-Host "  Email: $($userData.email)" -ForegroundColor Gray
    Write-Host "  Hobbies: $($userData.hobbies -join ', ')" -ForegroundColor Gray
    Write-Host ""
} catch {
    Write-Host "✗ Profile fetch failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  ✓ All tests passed!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Your authentication is working correctly." -ForegroundColor White
Write-Host "You can now use these credentials in the frontend:" -ForegroundColor White
Write-Host "  Username: testuser" -ForegroundColor Cyan
Write-Host "  Password: testpass123" -ForegroundColor Cyan
