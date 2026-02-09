interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md',
  fullScreen = false 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8 border-2',
    md: 'w-16 h-16 border-4',
    lg: 'w-24 h-24 border-4'
  };

  const containerClasses = fullScreen
    ? 'min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-accent/5'
    : 'flex items-center justify-center py-12';

  return (
    <div className={containerClasses}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4`}></div>
        <p className="text-muted-foreground">{message}</p>
      </div>
    </div>
  );
}
