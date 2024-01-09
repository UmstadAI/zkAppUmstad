from setuptools import setup, find_packages

with open("requirements.txt") as f:
    requirements = f.read().splitlines()

setup(
    name="zkappsumstadcli",
    version="0.1.0",
    author="Berkin Gurcan, Dogukan Akar",
    author_email="berkingurcan@gmail.com, dogukanakarc@gmail.com",
    description="CLI AI Agent for zkApps Developers",
    long_description=open("./../README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/UmstadAI/zkappumstad",
    packages=find_packages(),
    install_requires=requirements,
    entry_points="""
        [console_scripts]
        zkappumstad=zkappumstad:main
    """,
)
