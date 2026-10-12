// apps/api/src/config/validate-config.ts

export function validateConfig(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const requiredProperties = [
    'DATABASE_URL',
    'JWT_SECRET',
  ];

  const missingProperties = requiredProperties.filter((property) => {
    const value = config[property];

    return typeof value !== 'string' || value.trim().length === 0;
  });

  if (missingProperties.length > 0) {
    throw new Error(
      `Missing required configuration: ${missingProperties.join(', ')}`,
    );
  }

  return config;
}