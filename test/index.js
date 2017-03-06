/**
 * Tests!
 */

'use strict';

const assert = require('assert');
const $ = require('../').default;

it('デフォルトの値を設定できる', () => {
	const def = 'strawberry pasta';
	const [val = def, err] = $(undefined).optional.string().$;
	assert.equal(val, def);
	assert.equal(err, null);
});

describe('統合', () => {

	it('正しく成功する', () => {
		const err = $('strawberry pasta').string().min(1).min(10).result;
		assert.equal(err, null);
	});

	it('正しく失敗する', () => {
		const err = $('alice').string().min(1).min(10).result;
		assert.notEqual(err, null);
	});

	describe('遅延評価', () => {
		it('正しく成功する', () => {
			const err = $().string().min(10).report('strawberry pasta');
			assert.equal(err, null);
		});

		it('正しく失敗する', () => {
			const err = $().string().min(10).report('alice');
			assert.notEqual(err, null);
		});
	});

	describe('入れ子', () => {
		it('正しく成功する', () => {
			const err = $([1, 2, 3]).array().each($().number().range(0, 100)).result;
			assert.equal(err, null);
		});

		it('正しく失敗する', () => {
			const err = $([1, -1, 3]).array().each($().number().range(0, 100)).result;
			assert.notEqual(err, null);
		});
	});
});

describe('Common', () => {

	it('nullを与えられない', () => {
		const err = $(null).string().result;
		assert.notEqual(err, null);
	});

	it('undefinedを与えられない', () => {
		const err = $(undefined).string().result;
		assert.notEqual(err, null);
	});

	describe('optional', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).optional.string().$;
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられない', () => {
			const err = $(null).optional.string().result;
			assert.notEqual(err, null);
		});

		it('undefinedを与えられる', () => {
			const err = $(undefined).optional.string().result;
			assert.equal(err, null);
		});
	});

	describe('nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).nullable.string().$;
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = $(null).nullable.string().result;
			assert.equal(err, null);
		});

		it('undefinedを与えられない', () => {
			const err = $(undefined).nullable.string().result;
			assert.notEqual(err, null);
		});
	});

	describe('optional + nullable', () => {
		it('値を与えられる', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).nullable.optional.string().$;
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('nullを与えられる', () => {
			const err = $(null).nullable.optional.string().result;
			assert.equal(err, null);
		});

		it('undefinedを与えらる', () => {
			const err = $(undefined).nullable.optional.string().result;
			assert.equal(err, null);
		});
	});

	describe('# validate', () => {
		it('バリデータが true を返したら合格', () => {
			const err = $('strawberry pasta').string().validate(() => true).result;
			assert.equal(err, null);
		});

		it('バリデータが false を返したら失格', () => {
			const err = $('strawberry pasta').string().validate(() => false).result;
			assert.notEqual(err, null);
		});

		it('バリデータが Error を返したら失格', () => {
			const err = $('strawberry pasta').string().validate(() => new Error('something')).result;
			assert.notEqual(err, null);
		});
	});
});

describe('Queries', () => {
	describe('String', () => {
		it('正当な値を与える', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).string().$;
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('文字列以外でエラー', () => {
			const x = [1, 2, 3];
			const [val, err] = $(x).string().$;
			assert.notEqual(err, null);
		});

		describe('# min', () => {
			it('しきい値より長くて成功', () => {
				const err = $('strawberry').string().min(8).result;
				assert.equal(err, null);
			});

			it('しきい値より短くて失敗', () => {
				const err = $('pasta').string().min(8).result;
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より短くて成功', () => {
				const err = $('pasta').string().max(8).result;
				assert.equal(err, null);
			});

			it('しきい値より長くて失敗', () => {
				const err = $('strawberry').string().max(8).result;
				assert.notEqual(err, null);
			});
		});

		describe('# or', () => {
			it('合致する文字列で成功 (配列)', () => {
				const err = $('strawberry').string().or(['strawberry', 'pasta']).result;
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (配列)', () => {
				const err = $('alice').string().or(['strawberry', 'pasta']).result;
				assert.notEqual(err, null);
			});

			it('合致する文字列で成功 (文字列)', () => {
				const err = $('strawberry').string().or('strawberry pasta').result;
				assert.equal(err, null);
			});

			it('合致しない文字列で失敗 (文字列)', () => {
				const err = $('alice').string().or('strawberry pasta').result;
				assert.notEqual(err, null);
			});
		});
	});

	describe('Number', () => {
		it('正当な値を与える', () => {
			const x = 42;
			const [val, err] = $(x).number().$;
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('数値以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).number().$;
			assert.notEqual(err, null);
		});

		describe('# int', () => {
			it('整数で合格', () => {
				const err = $(42).number().int().result;
				assert.equal(err, null);
			});

			it('非整数で不合格', () => {
				const err = $(3.14).number().int().result;
				assert.notEqual(err, null);
			});
		});

		describe('# min', () => {
			it('しきい値より大きくて成功', () => {
				const err = $(50).number().min(42).result;
				assert.equal(err, null);
			});

			it('しきい値より小さくて失敗', () => {
				const err = $(30).number().min(42).result;
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より小さくて成功', () => {
				const err = $(30).number().max(42).result;
				assert.equal(err, null);
			});

			it('しきい値より大きくて失敗', () => {
				const err = $(50).number().max(42).result;
				assert.notEqual(err, null);
			});
		});
	});

	describe('Array', () => {
		it('正当な値を与える', () => {
			const x = [1, 2, 3];
			const [val, err] = $(x).array().$;
			assert.equal(val, x);
			assert.equal(err, null);
		});

		it('配列以外でエラー', () => {
			const x = 'strawberry pasta';
			const [val, err] = $(x).array().$;
			assert.notEqual(err, null);
		});

		describe('要素の型指定', () => {
			it('正当な値を与えて合格', () => {
				const err = $(['a', 'b', 'c']).array('string').result;
				assert.equal(err, null);
			});

			it('不正な値を与えて不合格', () => {
				const err = $(['a', 1, 'c']).array('string').result;
				assert.notEqual(err, null);
			});
		});

		describe('# unique', () => {
			it('ユニークで合格', () => {
				const err = $(['a', 'b', 'c']).array().unique().result;
				assert.equal(err, null);
			});

			it('重複した要素が有って不合格', () => {
				const err = $(['a', 'b', 'c', 'b']).array().unique().result;
				assert.notEqual(err, null);
			});
		});

		describe('# min', () => {
			it('しきい値より長くて成功', () => {
				const err = $([1, 2, 3, 4]).array().min(3).result;
				assert.equal(err, null);
			});

			it('しきい値より短くて失敗', () => {
				const err = $([1, 2]).array().min(3).result;
				assert.notEqual(err, null);
			});
		});

		describe('# max', () => {
			it('しきい値より短くて成功', () => {
				const err = $([1, 2]).array().max(3).result;
				assert.equal(err, null);
			});

			it('しきい値より長くて失敗', () => {
				const err = $([1, 2, 3, 4]).array().max(3).result;
				assert.notEqual(err, null);
			});
		});

		describe('# each', () => {
			it('バリデータが true を返したら合格', () => {
				const err = $([1, 2, 3]).array().each(() => true).result;
				assert.equal(err, null);
			});

			it('バリデータが false を返したら失格', () => {
				const err = $([1, 2, 3]).array().each(() => false).result;
				assert.notEqual(err, null);
			});

			it('バリデータが Error を返したら失格', () => {
				const err = $([1, 2, 3]).array().each(() => new Error('something')).result;
				assert.notEqual(err, null);
			});
		});
	});
});
