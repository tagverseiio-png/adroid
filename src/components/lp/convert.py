import os
import glob
import re

directory = "/Users/user/Workspace/Projects/Strucureo_Projects/Harry_projects/Adroit_design/src/components/lp"
for filepath in glob.glob(os.path.join(directory, "*.jsx")):
    with open(filepath, "r") as f:
        content = f.read()

    # 1. Remove "use client";
    content = re.sub(r'["\']use client["\'];?\s*', '', content)

    # 2. Convert next/image to standard img
    content = re.sub(r'import\s+Image\s+from\s+[\'"]next/image[\'"];?\s*', '', content)
    # Convert <Image src="..." alt="..." width={...} height={...} /> to <img ... />
    # Also handle fill/priority which we can just remove
    content = re.sub(r'<Image\s+([^>]*?)(?:/?)>', r'<img \1/>', content)
    # Remove Next.js specific props like fill, priority, sizes from img
    content = re.sub(r'\b(fill|priority|sizes=[\'"][^\'"]*[\'"]|placeholder=[\'"][^\'"]*[\'"])\s*', '', content)

    # 3. Convert next/link to standard a
    content = re.sub(r'import\s+Link\s+from\s+[\'"]next/link[\'"];?\s*', '', content)
    content = re.sub(r'<Link\b([^>]*)>', r'<a\1>', content)
    content = re.sub(r'</Link>', r'</a>', content)
    
    # 4. Handle next/navigation useRouter (LeadForm.js / LeadFormModal.js)
    content = re.sub(r'import\s+\{\s*useRouter\s*\}\s+from\s+[\'"]next/navigation[\'"];?\s*', '', content)
    # Replace useRouter() usage with a dummy or standard window.location change for now
    content = re.sub(r'const\s+router\s*=\s*useRouter\(\);\s*', '', content)
    content = re.sub(r'router\.push\(([`\'"])(.*?)\1\);', r'window.location.pathname = \1\2\1;', content)

    with open(filepath, "w") as f:
        f.write(content)
print("Conversion complete!")
