export const deprecatedCodeRules = [
  {
    comment:
      'Overriding the constructor of a SmartContract is disallowed. Please remove the constructor.',
    code: 'constructor()'
  },
  {
    comment: 'A Smart Contract can only have 8 allowed storage fields.',
    code: ''
  },
  {
    comment:
      'A `if` statement should not be used in a circuit. Please use `Circuit.if` instead.',
    code: 'if'
  },
  {
    comment:
      'JavaScript JSON function usage should be avoided in a circuit. The resulting values do not make it into the circuit.',
    code: 'JSON.'
  },
  {
    comment:
      'JavaScript randomness usage should be avoided in a circuit. The randomness cannot be verified and thus should not be included in a circuit',
    code: 'Math.random()'
  },
  {
    comment:
      'A `ternary` statement should not be used in a circuit. Please use `Circuit.if` instead.',
    code: 'x ? y : z'
  },
  {
    comment: 'A `throw` statement should not be used in a circuit.',
    code: 'throw'
  },
  {
    comment:
      '/**\n * @deprecated `await isReady` is no longer needed. Remove it from your code.\n */',
    code: 'let isReady = Promise.resolve()'
  },
  {
    comment:
      '/**\n * @deprecated `shutdown()` is no longer needed, and is a no-op. Remove it from your code.\n */',
    code: 'function shutdown()'
  },
  {
    comment:
      '/**\n   * @deprecated use `this.state.getAndRequireEquals()` which is equivalent\n   */',
    code: 'getAndAssertEquals(): A'
  },
  {
    comment:
      '/**\n   * @deprecated use `this.state.requireEquals()` which is equivalent\n   */',
    code: 'assertEquals(a: A): void'
  },
  {
    comment:
      '/**\n   * @deprecated use `this.state.requireNothing()` which is equivalent\n   */',
    code: 'assertNothing(): void'
  },
  {
    comment:
      '/**\n * @deprecated `CircuitValue` is deprecated in favor of {@link Struct}, which features a simpler API and better typing.\n */',
    code: 'abstract class CircuitValue'
  },
  {
    comment:
      '/**\n   * @deprecated `this.sign()` is deprecated in favor of `this.requireSignature()`\n   */',
    code: 'sign(zkappKey?: PrivateKey)'
  },
  {
    comment: '/**\n   * @deprecated use `this.account.<field>.set()`\n   */',
    code: 'setValue<T>(maybeValue: SetOrKeep<T>, value: T)'
  },
  {
    comment:
      '/**\n   * @deprecated use `this.account.permissions.set()`\n   */',
    code: 'setPermissions(permissions: Permissions)'
  },
  {
    comment:
      '/**\n   * Coerces two x and y coordinates into a {@link Group} element.\n   */\n  static from(\n    x: FieldVar | Field | number | string | bigint,\n    y: FieldVar | Field | number | string | bigint\n  ) {\n    return new Group({ x, y });\n  }\n\n  /**\n   * @deprecated Please use the method `.add` on the instance instead\n   *\n   * Adds a {@link Group} element to another one.\n   */',
    code: 'static add(g1: Group, g2: Group)'
  },
  {
    comment:
      '/**\n   * @deprecated Please use the method `.neg` on the instance instead\n   *\n   * Negates a {@link Group} element. Under the hood, it simply negates the `y` coordinate and leaves the `x` coordinate as is.\n   *\n   * ```typescript\n   * let gNeg = Group.neg(g);\n   * ```\n   */',
    code: 'static neg(g: Group)'
  },
  {
    comment:
      '/**\n   * @deprecated Please use the method `.scale` on the instance instead\n   *\n   * Elliptic curve scalar multiplication. Scales a {@link Group} element `n`-times by itself, where `n` is the {@link Scalar}.\n   *\n   * ```typescript\n   * let s = Scalar(5);\n   * let 5g = Group.scale(g, s);\n   * ```\n   */',
    code: 'static scale(g: Group, s: Scalar)'
  },
  {
    comment:
      '/**\n   * @deprecated Please use the method `.assertEqual` on the instance instead.\n   *\n   * Assert that two {@link Group} elements are equal to another.\n   * Throws an error if the assertion fails.\n   *\n   * ```ts\n   * Group.assertEquals(g1, g2);\n   * ```\n   */',
    code: 'static assertEqual(g1: Group, g2: Group)'
  },
  {
    comment:
      '/**\n   * @deprecated Please use the method `.equals` on the instance instead.\n   *\n   * Checks if a {@link Group} element is equal to another {@link Group} element.\n   * Returns a {@link Bool}.\n   *\n   * ```ts\n   * Group.equal(g1, g2); // Bool(true)\n   * ```\n   */',
    code: 'static equal(g1: Group, g2: Group)'
  },
  {
    comment:
      '/**\n   * @deprecated use `getAndRequireEquals()` which is equivalent\n   */',
    code: 'getAndAssertEquals(): U'
  },
  {
    comment:
      '/**\n   * @deprecated use `requireEquals(value: U)` which is equivalent\n   */',
    code: 'assertEquals(value: U): void'
  },
  {
    comment:
      '/**\n   * @deprecated use `requireNothing()` which is equivalent\n   */',
    code: 'assertNothing(): void'
  },
  {
    comment: '/**\n   * @deprecated use {@link Scalar.from}\n   */',
    code: 'static fromBigInt(x: bigint)'
  },
  {
    comment: '/**\n   * @deprecated use `this.account.tokenSymbol`\n   */',
    code: 'get tokenSymbol()'
  },
  {
    comment:
      '/**\n   * @deprecated `.sign()` is deprecated in favor of `.requireSignature()`\n   */',
    code: 'sign(privateKey?: PrivateKey)'
  },
  {
    comment:
      '/**\n   * @deprecated in favor of calling this function with a `PublicKey` as `signer`\n   */',
    code: 'static createSigned(signer: PrivateKey, tokenId?: Field): AccountUpdate'
  },
  {
    comment:
      '/**\n   * Verifies a proof using the public input, the proof, and the initial {@link Keypair} of the circuit.\n   * @example\n   * ```ts\n   * const keypair = await MyCircuit.generateKeypair();\n   * const proof = await MyCircuit.prove(privateInput, publicInput, keypair);\n   * const isValid = await MyCircuit.verify(publicInput, keypair.vk, proof);\n   * ```\n   */\n  static verify(\n    publicInput: any[],\n    verificationKey: VerificationKey,\n    proof: Proof\n  ) {\n    let publicInputFields = this._main.publicInputType.toFields(publicInput);\n    return prettifyStacktracePromise(\n      withThreadPool(async () =>\n        Snarky.circuit.verify(\n          MlFieldConstArray.to(publicInputFields),\n          proof.value,\n          verificationKey.value\n        )\n      )\n    );\n  }\n\n  // utility namespace, moved to `Provable`\n\n  /**\n   * @deprecated use {@link Provable.witness}\n   */',
    code: 'static witness = Provable.witness'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.asProver}\n   */',
    code: 'static asProver = Provable.asProver'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.runAndCheck}\n   */',
    code: 'static runAndCheck = Provable.runAndCheck'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.runUnchecked}\n   */',
    code: 'static runUnchecked = Provable.runUnchecked'
  },
  {
    comment:
      '/**\n   * @deprecated use {@link Provable.constraintSystem}\n   */',
    code: 'static constraintSystem = Provable.constraintSystem'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.Array}\n   */',
    code: 'static array = Provable.Array'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.assertEqual}\n   */',
    code: 'static assertEqual = Provable.assertEqual'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.equal}\n   */',
    code: 'static equal = Provable.equal'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.if}\n   */',
    code: 'static if = Provable.if'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.switch}\n   */',
    code: 'static switch = Provable.switch'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.inProver}\n   */',
    code: 'static inProver = Provable.inProver'
  },
  {
    comment: '/**\n   * @deprecated use {@link Provable.log}\n   */',
    code: 'static log = Provable.log'
  },
  {
    comment:
      "/**\n * @deprecated It's deprecated to pass in the fee payer's private key. Pass in the public key instead.\n * ```\n * // good\n * Mina.transaction(publicKey, ...);\n * Mina.transaction({ sender: publicKey }, ...);\n *\n * // deprecated\n * Mina.transaction(privateKey, ...);\n * Mina.transaction({ feePayerKey: privateKey }, ...);\n * ```\n */\nfunction transaction(\n  sender: DeprecatedFeePayerSpec,\n  f: () => void\n): Promise<Transaction>;\nfunction transaction(\n  senderOrF: DeprecatedFeePayerSpec | (() => void),\n  fOrUndefined?: () => void\n): Promise<Transaction> {\n  let sender: DeprecatedFeePayerSpec;\n  let f: () => void;\n  try {\n    if (fOrUndefined !== undefined) {\n      sender = senderOrF as DeprecatedFeePayerSpec;\n      f = fOrUndefined;\n    } else {\n      sender = undefined;\n      f = senderOrF as () => void;\n    }\n    return activeInstance.transaction(sender, f);\n  } catch (error) {\n    throw prettifyStacktrace(error);\n  }\n}\n\n/**\n * Returns the public key of the current transaction's sender account.\n *\n * Throws an error if not inside a transaction, or the sender wasn't passed in.\n */",
    code: 'function sender()'
  },
  {
    comment:
      '/**\n   * @deprecated use `x.equals(0)` which is equivalent\n   */',
    code: 'isZero()'
  }
]
