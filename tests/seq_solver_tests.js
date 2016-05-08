function assert(value) {
    if (!value) {
        throw "Assersion error!";
    }
}
function testDeduce() {
}
function testIsBlackAt() {
    assert(isBlackAt(Square.TriTL, 1));
    assert(!isBlackAt(Square.TriTL, 3));
    assert(isBlackAt(Square.TriTR, 3));
    assert(!isBlackAt(Square.TriTR, 2));
    assert(isBlackAt(Square.TriBL, 1));
    assert(!isBlackAt(Square.TriBL, 3));
    assert(isBlackAt(Square.TriBR, 3));
    assert(!isBlackAt(Square.TriBR, 0));
}
function test() {
    testDeduce();
    testIsBlackAt();
}
