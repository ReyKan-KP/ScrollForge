# Contributing to ScrollForge

First off, thank you for considering contributing to ScrollForge! It's people like you that make ScrollForge such a great tool. 🎉

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Pull Request Process](#pull-request-process)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Show empathy towards other community members

## 🤝 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Include screenshots and animated GIFs**
- **Describe the behavior you observed and expected**
- **Include your environment details**

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion, please include:

- **Use a clear and descriptive title**
- **Provide a detailed description**
- **Provide specific use cases**
- **Include mockups or examples if applicable**

### Your First Code Contribution

Unsure where to begin? You can start by looking through these issues:

- `good first issue` - issues which should only require a few lines of code
- `help wanted` - issues which need extra attention
- `documentation` - improvements or additions to documentation

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/ScrollForge.git
   cd ScrollForge
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ReyKan-KP/ScrollForge.git
   ```
4. **Create a branch** for your feature:
   ```bash
   git checkout -b feature/amazing-feature
   ```

## 💻 Development Setup

### Frontend Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run FastAPI server
uvicorn main:app --reload
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key
```

## 🔄 Pull Request Process

1. **Update the README.md** with details of changes if applicable
2. **Update the documentation** if you're changing functionality
3. **Write or update tests** as needed
4. **Ensure all tests pass** before submitting
5. **Update the CHANGELOG.md** with your changes
6. **Follow the style guidelines** below
7. **Request review** from maintainers

### PR Title Format

Use conventional commits format:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation only changes
- `style:` Code style changes (formatting, etc)
- `refactor:` Code change that neither fixes a bug nor adds a feature
- `perf:` Performance improvements
- `test:` Adding missing tests
- `chore:` Changes to build process or auxiliary tools

Example: `feat: add PDF annotation support`

## 🎨 Style Guidelines

### TypeScript/JavaScript

- Use TypeScript for all new code
- Follow ESLint configuration
- Use meaningful variable and function names
- Add JSDoc comments for functions
- Keep functions small and focused

```typescript
// Good
export function convertPdfToHtml(file: File): Promise<string> {
  // Implementation
}

// Bad
export function convert(f: any) {
  // Implementation
}
```

### React Components

- Use functional components with hooks
- Keep components small and reusable
- Use proper TypeScript types for props
- Follow naming conventions (PascalCase for components)

```tsx
// Good
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return (
    <button className={`btn-${variant}`} onClick={onClick}>
      {label}
    </button>
  );
}
```

### CSS/Tailwind

- Use Tailwind CSS utilities when possible
- Keep custom CSS minimal
- Follow mobile-first approach
- Use CSS variables for theming

### Python

- Follow PEP 8 style guide
- Use type hints
- Add docstrings to functions
- Keep functions pure when possible

```python
def process_pdf(file_path: str) -> Dict[str, Any]:
    """
    Process a PDF file and extract content.
    
    Args:
        file_path: Path to the PDF file
        
    Returns:
        Dictionary containing extracted content
    """
    # Implementation
```

## 🧪 Testing

- Write unit tests for utilities and helpers
- Write integration tests for API endpoints
- Write E2E tests for critical user flows
- Aim for >80% code coverage

## 📝 Documentation

- Update README for user-facing changes
- Update API documentation for endpoint changes
- Add inline comments for complex logic
- Update TypeScript types and interfaces

## 🌟 Recognition

Contributors will be:
- Listed in our README
- Mentioned in release notes
- Given credit in commit messages

## 💬 Community

- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Pull Requests**: Submit your contributions

## 🙏 Thank You!

Thank you for contributing to ScrollForge! Your efforts help make PDF conversion better for everyone. ⭐

---

**Remember to star ⭐ the repository and follow [@ReyKan-KP](https://github.com/ReyKan-KP) for updates!**