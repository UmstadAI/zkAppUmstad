from setuptools import setup, find_packages

with open("requirements.txt") as f:
    requirements = f.read().splitlines()

setup(
    name="zkappumstad",
    version="0.1.5",
    author="Berkin Gurcan, Dogukan Akar",
    author_email="berkingurcan@gmail.com, dogukanakarc@gmail.com",
    description="CLI AI Agent for zkApps Developers",
    long_description=open("./README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/UmstadAI/zkAppUmstad/tree/main/cli",
    packages=find_packages(),
    install_requires=requirements,
    entry_points="""
        [console_scripts]
        zkumstad-start=zkappumstad.__main__:main
        zkumstad-create=zkappumstad.create:run_zk_command
    """,
    classifiers=[
        'Topic :: Software Development :: Build Tools',
        'License :: OSI Approved :: MIT License',
        'Programming Language :: Python :: 3',
        'Programming Language :: Python :: 3.10',
    ],
    python_requires='>=3.10', 
    keywords='zkapps, zkappumstad, zkapps agent',
    zip_safe=False
)
