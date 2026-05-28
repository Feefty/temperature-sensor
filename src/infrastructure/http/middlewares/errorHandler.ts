export const errorHandler = (err: any, _req: any, res: any) => {
  console.error(err);

  res.status(500).json({
    error: 'Internal server error',
  });
};