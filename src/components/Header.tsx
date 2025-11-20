const Header = ({ title, description }) => {
  return (
    <div className="mb-16 text-center">
      <h1 className="mb-4 text-4xl font-bold text-foreground md:text-5xl">
        {title}
      </h1>
      <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
        {description}
      </p>
    </div>
  );
};

export default Header;