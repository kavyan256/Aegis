export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validatePhone = (phone) => {
  return phone.length >= 10
}

export const validateForm = (fields) => {
  const errors = {}
  
  Object.keys(fields).forEach((key) => {
    const value = fields[key]
    if (!value || value.trim() === '') {
      errors[key] = `${key} is required`
    }
  })

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateLoginForm = ({ email, password }) => {
  const errors = {}

  if (!email) errors.email = 'Email is required'
  else if (!validateEmail(email)) errors.email = 'Invalid email'

  if (!password) errors.password = 'Password is required'
  else if (!validatePassword(password)) errors.password = 'Password must be at least 6 characters'

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}

export const validateRegisterForm = ({ email, password, confirmPassword, phone }) => {
  const errors = {}

  if (!email) errors.email = 'Email is required'
  else if (!validateEmail(email)) errors.email = 'Invalid email'

  if (!password) errors.password = 'Password is required'
  else if (!validatePassword(password)) errors.password = 'Password must be at least 6 characters'

  if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match'

  if (!phone) errors.phone = 'Phone is required'
  else if (!validatePhone(phone)) errors.phone = 'Invalid phone number'

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
