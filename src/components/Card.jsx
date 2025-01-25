const Card = ({ children }) => (
    <div className="border rounded-lg shadow-md p-4">{children}</div>
  );
  
  const CardContent = ({ children }) => <div>{children}</div>;
  
  export { Card, CardContent };
  