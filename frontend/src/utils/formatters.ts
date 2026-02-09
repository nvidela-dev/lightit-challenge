export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

export const formatPhone = (code: string, number: string): string =>
  `${code} ${number.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')}`;

export const capitalizeWords = (str: string): string =>
  str
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
