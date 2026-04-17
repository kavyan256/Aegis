# Aegis ID Enum Mapping Refactoring Guide

## Overview
This refactoring ensures consistent handling of Prisma enums across the frontend and backend. The system uses uppercase enum values internally (FIRST_YEAR, SECOND_YEAR, etc.) while displaying user-friendly labels in the UI ("1st Year", "2nd Year", etc.).

## Architecture

### Single Source of Truth
- **Frontend**: `frontend/utils/enumMappings.js` - Contains all UI label mappings and helper functions
- **Backend**: `backend/utils/enumConstants.js` - Reference documentation for enum values (informational only)
- **Database**: Prisma schema defines the actual enum types

### Data Flow

```
User Input (UI Label)
        ↓
Frontend Mapping (Reverse Map)
        ↓
API Payload (Enum Value: FIRST_YEAR)
        ↓
Backend Validation & Normalization
        ↓
Prisma/Database (Store enum value)
        ↓
API Response (Enum Value: FIRST_YEAR)
        ↓
Frontend Mapping (Display Label: "1st Year")
        ↓
User sees UI Label
```

## Key Files Modified

### Frontend Files

#### 1. `frontend/utils/enumMappings.js` (NEW)
Centralized mappings for all enums. Contains:
- `AcademicYearMap`: Maps enum → label ("FIRST_YEAR" → "1st Year")
- `AcademicYearReverseMap`: Maps label → enum ("1st Year" → "FIRST_YEAR")
- `AcademicYearList`: Array of enum values for dropdowns
- Similar mappings for Department, Gender, OutpassStatus, EmergencyType, etc.
- Helper functions: `getAcademicYearLabel()`, `getAcademicYearEnum()`, etc.

#### 2. `frontend/screens/RegisterScreen.js` (UPDATED)
- Import: Added `AcademicYearList`, `AcademicYearReverseMap`, `DepartmentList`, `DepartmentReverseMap`
- Form data default: Changed `year: "2nd Year"` to `year: "SECOND_YEAR"`
- Arrays: Changed to use `DepartmentList` and `AcademicYearList` instead of hardcoded strings
- Data handling: Form stores and sends enum values directly

#### 3. `frontend/components/StudentRegisterCard.js` (UPDATED)
- Import: Added `AcademicYearMap`, `DepartmentMap`
- Picker labels: Changed to display `AcademicYearMap[year]` and `DepartmentMap[dept]`
- Values: Still stores enum values (FIRST_YEAR, IT, etc.)

#### 4. `frontend/screens/ProfileScreen.js` (UPDATED)
- Import: Added `AcademicYearList`, `AcademicYearMap`, `DepartmentList`, `DepartmentMap`
- Display: Uses `AcademicYearMap[profile.year]` to show labels in read-only view
- Edit mode: Picker uses `AcademicYearMap[y]` for labels but stores enum values
- Arrays: Changed to use `DepartmentList` and `AcademicYearList`

### Backend Files

#### 1. `backend/utils/enumConstants.js` (NEW)
Reference file documenting enum values. Used for understanding but not strictly required by the backend.

#### 2. `backend/routes/authRoutes.js` (UPDATED)
- `yearMap`: Updated all mappings to produce uppercase enum values
  - Now maps user input → FIRST_YEAR (was year_1)
  - Accepts multiple input formats for backward compatibility
  - Added explicit uppercase enum value keys (FIRST_YEAR, SECOND_YEAR, etc.)

## Usage Guidelines

### Frontend: Displaying Data

```javascript
import { AcademicYearMap, DepartmentMap } from "../utils/enumMappings"

// When receiving from API:
const yearLabel = AcademicYearMap[user.year]  // "1st Year"
const deptLabel = DepartmentMap[user.department]  // "IT"

// Or use helper functions:
import { getAcademicYearLabel, getDepartmentLabel } from "../utils/enumMappings"
const yearLabel = getAcademicYearLabel(user.year)
```

### Frontend: Form Handling

```javascript
import { AcademicYearList, AcademicYearMap } from "../utils/enumMappings"

// Render picker with enum values as keys, labels as display text
{AcademicYearList.map(year => (
  <Picker.Item 
    key={year}
    label={AcademicYearMap[year]}  // "1st Year"
    value={year}                    // "FIRST_YEAR"
  />
))}

// Form state stores enum values directly
const [formData, setFormData] = useState({ year: "FIRST_YEAR" })

// Send to API as-is (no conversion needed)
api.post("/auth/register", formData)
```

### Backend: Receiving Data

```javascript
// Backend receives enum values from frontend
const { year } = req.body  // "FIRST_YEAR"

// Use normalizeYear() to handle legacy inputs
const normalizedYear = normalizeYear(year)  // "FIRST_YEAR"

// Store directly in database
await prisma.user.create({
  data: { year: normalizedYear }
})
```

### Backend: Sending Data

```javascript
// Backend sends enum values as-is
const user = await prisma.user.findUnique({ ... })
res.json({ user: serializeUser(user) })

// Frontend handles display conversion
```

## Enum Values Reference

### AcademicYear
| Database Enum | Frontend Label |
|---------------|---|
| FIRST_YEAR    | 1st Year |
| SECOND_YEAR   | 2nd Year |
| THIRD_YEAR    | 3rd Year |
| FOURTH_YEAR   | 4th Year |

### Department
| Database Enum | Frontend Label |
|---|---|
| IT | IT |
| IT_BI | IT BI |
| Electronics | Electronics |

### Gender
| Database Enum | Frontend Label |
|---|---|
| male | Male |
| female | Female |
| other | Other |

## Backward Compatibility

The backend `yearMap` normalizes various input formats for backward compatibility:
- Numeric: 1, 2, 3, 4 → FIRST_YEAR, SECOND_YEAR, etc.
- Variants: year1, year_1, year_1, "1st year" → FIRST_YEAR, etc.
- Direct enum values: FIRST_YEAR → FIRST_YEAR

## No Hardcoded Strings Rule

❌ **NEVER hardcode strings:**
```javascript
// DON'T DO THIS
<Text>{profile.year}</Text>  // Shows "FIRST_YEAR"
const year = "1st Year"
```

✅ **ALWAYS use mappings:**
```javascript
// DO THIS
import { AcademicYearMap, getAcademicYearLabel } from "../utils/enumMappings"
<Text>{AcademicYearMap[profile.year]}</Text>  // Shows "1st Year"
const year = getAcademicYearLabel("FIRST_YEAR")
```

## Testing Checklist

- [ ] Registration form displays year/department labels correctly
- [ ] Registration sends enum values to backend (not labels)
- [ ] Backend receives and stores enum values correctly
- [ ] Profile page displays labels correctly for existing enum values
- [ ] Profile edit mode shows correct labels in pickers
- [ ] Profile save sends enum values to backend
- [ ] Dashboard/Cards display labels correctly
- [ ] No console warnings about missing enum values

## Future Enhancements

1. **Type Safety**: Add TypeScript types for enums
2. **Shared Constants**: Consider creating a shared constants package used by both frontend and backend
3. **API Documentation**: Update API docs to show that backend accepts/returns enum values
4. **Migrations**: If adding new enum values, update both mappings and database

## Troubleshooting

**Issue**: Forms showing enum values instead of labels
- **Fix**: Ensure you're importing and using the mappings in the picker labels

**Issue**: Backend rejecting form submissions
- **Fix**: Verify form is sending enum values (check network tab), not labels

**Issue**: Profile showing undefined values
- **Fix**: Check that `AcademicYearMap` contains the enum value from the API response
