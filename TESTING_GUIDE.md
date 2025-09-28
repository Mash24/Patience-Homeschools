# 🧪 Testing Guide

## Complete System Testing Checklist

### 1. Environment Setup ✅
- [ ] Supabase project created
- [ ] Environment variables configured
- [ ] Database schema deployed
- [ ] Storage bucket created
- [ ] Storage policies configured

### 2. Authentication Flow Testing

#### 2.1 Teacher Application Flow
1. **Visit Application Page**
   - Go to `http://localhost:3000/teacher-apply`
   - Verify form loads correctly
   - Test form validation

2. **Submit Application**
   - Fill out all required fields
   - Upload test documents
   - Submit application
   - Verify success page appears

3. **Check Email**
   - Look for magic link email
   - Click magic link
   - Verify redirect to teacher dashboard

#### 2.2 Teacher Dashboard Testing
1. **Access Dashboard**
   - Sign in with magic link
   - Verify dashboard loads
   - Check application status

2. **Document Management**
   - View uploaded documents
   - Test document download/view
   - Verify document status

#### 2.3 Admin Panel Testing
1. **Access Admin Panel**
   - Sign in as admin
   - Go to `http://localhost:3000/admin`
   - Verify admin dashboard loads

2. **Review Applications**
   - View pending applications
   - Test search and filtering
   - Review teacher details

3. **Approve/Reject Teachers**
   - Approve a test teacher
   - Verify status updates
   - Check email notifications

### 3. Integration Testing

#### 3.1 Hire-Teacher Page Integration
1. **View Approved Teachers**
   - Go to `http://localhost:3000/hire-teacher`
   - Verify approved teachers appear
   - Test teacher card interactions

2. **Teacher Filtering**
   - Test subject filters
   - Test curriculum filters
   - Test location filters

3. **Teacher Details**
   - Expand teacher cards
   - Verify all information displays
   - Test responsive design

### 4. Security Testing

#### 4.1 Route Protection
1. **Unauthorized Access**
   - Try accessing `/admin` without login
   - Try accessing `/teacher/dashboard` without login
   - Verify redirects to login page

2. **Role-Based Access**
   - Sign in as teacher, try accessing `/admin`
   - Sign in as admin, verify admin access
   - Test middleware protection

#### 4.2 Data Security
1. **RLS Policies**
   - Verify teachers can only see their own data
   - Verify admins can see all data
   - Test document access permissions

### 5. Performance Testing

#### 5.1 Load Testing
1. **Multiple Applications**
   - Submit multiple teacher applications
   - Verify system handles load
   - Check database performance

2. **Large Datasets**
   - Create multiple teachers
   - Test pagination and filtering
   - Verify response times

### 6. Error Handling Testing

#### 6.1 Form Validation
1. **Required Fields**
   - Submit form with missing required fields
   - Verify validation messages
   - Test field-specific validation

2. **File Upload**
   - Test invalid file types
   - Test oversized files
   - Test upload failures

#### 6.2 Network Errors
1. **Offline Testing**
   - Test with network disconnected
   - Verify error messages
   - Test retry mechanisms

### 7. Mobile Testing

#### 7.1 Responsive Design
1. **Teacher Cards**
   - Test on mobile devices
   - Verify expand/collapse functionality
   - Test touch interactions

2. **Forms**
   - Test form usability on mobile
   - Verify file upload on mobile
   - Test keyboard navigation

### 8. Browser Compatibility

#### 8.1 Cross-Browser Testing
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

#### 8.2 Feature Testing
- [ ] File uploads
- [ ] Form validation
- [ ] Animations
- [ ] Responsive design

## Test Data

### Sample Teacher Application
```json
{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+254700000000",
  "location": "Westlands, Nairobi",
  "subjects": ["Mathematics", "Physics"],
  "curricula": ["IGCSE", "CBC"],
  "gradeLevels": ["Grade 7-9", "Grade 10-12"],
  "experienceYears": 5,
  "educationBackground": "BSc Mathematics, University of Nairobi",
  "teachingPhilosophy": "Student-centered learning approach",
  "availability": ["Morning", "Evening"],
  "hourlyRateRange": "KES 2,000 - 3,000",
  "tscNumber": "TSC/12345/2020"
}
```

### Sample Documents
- CV: PDF file (max 5MB)
- Profile Photo: JPG/PNG (max 2MB)
- TSC Certificate: PDF file (max 5MB)
- Education Certificate: PDF file (max 5MB)

## Common Issues & Solutions

### Issue: Magic Link Not Working
**Solution**: Check email configuration and redirect URLs in Supabase

### Issue: Documents Not Uploading
**Solution**: Verify storage bucket permissions and policies

### Issue: Admin Access Denied
**Solution**: Run `npm run seed-admin` to create admin user

### Issue: Teachers Not Appearing on Hire-Teacher Page
**Solution**: Verify teacher status is 'approved' and is_verified is true

## Performance Benchmarks

### Expected Response Times
- Page loads: < 2 seconds
- Form submissions: < 3 seconds
- File uploads: < 10 seconds (depending on file size)
- Database queries: < 500ms

### Success Criteria
- [ ] All authentication flows work correctly
- [ ] Admin can approve/reject teachers
- [ ] Approved teachers appear on hire-teacher page
- [ ] All forms validate correctly
- [ ] File uploads work reliably
- [ ] Mobile experience is smooth
- [ ] No security vulnerabilities
- [ ] Performance meets benchmarks
