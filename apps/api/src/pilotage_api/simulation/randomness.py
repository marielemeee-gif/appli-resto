import hashlib
import random


def seeded_random(seed: int, *parts: object) -> random.Random:
    material = "|".join([str(seed), *(str(part) for part in parts)]).encode()
    derived_seed = int.from_bytes(hashlib.blake2b(material, digest_size=16).digest())
    return random.Random(derived_seed)
