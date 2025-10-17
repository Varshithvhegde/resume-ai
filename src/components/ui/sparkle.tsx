interface SparkleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  delay?: string;
}

const Sparkle = ({ className = "", size = "md", delay = "0ms" }: SparkleProps) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3", 
    lg: "w-4 h-4"
  };

  return (
    <div 
      className={`${sizeClasses[size]} text-yellow-400 animate-ping ${className}`}
      style={{ animationDelay: delay }}
    >
      <svg fill="currentColor" viewBox="0 0 24 24" className="w-full h-full">
        <path d="M12 0C12 0 14.5 6.5 21 9C14.5 11.5 12 18 12 18C12 18 9.5 11.5 3 9C9.5 6.5 12 0 12 0Z"/>
      </svg>
    </div>
  );
};

export default Sparkle;