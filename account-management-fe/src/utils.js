// Utility functions for the app
export const formatUserName = (firstName, lastName) => {
  if (!firstName && !lastName) return "Anonymous User";
  if (!firstName) return lastName;
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};

export const validateEmail = (email) => {
  if (!email || typeof email !== "string") return false;

  const trimmedEmail = email.trim();
  if (trimmedEmail === "") return false;

  // Check  for consecutive dots in local part
  if (trimmedEmail.includes("..")) return false;

  // Split email into local and domain parts
  const [localPart, domain] = trimmedEmail.split("@");
  if (!localPart || !domain) return false;

  // Check for leading/trailing dots in local part
  if (localPart.startsWith(".") || localPart.endsWith(".")) return false;

  // Domain must contain at least one dot and have valid TLD
  if (!domain.includes(".")) return false;

  // Basic email regex that handles most common cases
  const emailRegex =
    /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;

  return emailRegex.test(trimmedEmail);
};

export const calculateAge = (birthDate) => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};

export const formatCurrency = (amount, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};
