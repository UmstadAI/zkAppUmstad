class BaseEvaluable:
    def __init__(self, *args, **kwargs):
        self._args = args
        self._kwargs = kwargs

    def evaluate(self, message: str) -> str:
        raise NotImplementedError

    def __call__(self, message: str) -> str:
        return self.evaluate(message)
