import { Formulas, Logger } from '@nekorpg'

for (let i = 0; i < 100; i++) {
	Logger.info(Formulas.xpReq(i, 5), Formulas.xpReq(i, 100))
}
