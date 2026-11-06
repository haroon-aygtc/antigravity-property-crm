import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, Percent } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export function MortgageCalculator() {
    const [homePrice, setHomePrice] = useState(500000);
    const [downPayment, setDownPayment] = useState(100000);
    const [interestRate, setInterestRate] = useState(6.5);
    const [loanTerm, setLoanTerm] = useState(30);
    const [monthlyPayment, setMonthlyPayment] = useState(0);

    useEffect(() => {
        const principal = homePrice - downPayment;
        const monthlyRate = interestRate / 100 / 12;
        const numberOfPayments = loanTerm * 12;

        if (principal > 0 && interestRate > 0) {
            const mortgage =
                (principal * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
                (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
            setMonthlyPayment(mortgage);
        } else {
            setMonthlyPayment(0);
        }
    }, [homePrice, downPayment, interestRate, loanTerm]);

    return (
        <Card className="w-full max-w-xl mx-auto border-0 shadow-2xl bg-card/50 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl">
                    <Calculator className="h-6 w-6 text-primary" />
                    Mortgage Calculator
                </CardTitle>
                <CardDescription>
                    Estimate your monthly mortgage payments
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label>Home Price</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                value={homePrice}
                                onChange={(e) => setHomePrice(Number(e.target.value))}
                                className="pl-9"
                            />
                        </div>
                        <Slider
                            value={[homePrice]}
                            min={100000}
                            max={2000000}
                            step={10000}
                            onValueChange={(val) => setHomePrice(val[0])}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Down Payment (${downPayment.toLocaleString()})</Label>
                        <div className="relative">
                            <DollarSign className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="number"
                                value={downPayment}
                                onChange={(e) => setDownPayment(Number(e.target.value))}
                                className="pl-9"
                            />
                        </div>
                        <Slider
                            value={[downPayment]}
                            min={0}
                            max={homePrice}
                            step={5000}
                            onValueChange={(val) => setDownPayment(val[0])}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Interest Rate (%)</Label>
                            <div className="relative">
                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="number"
                                    value={interestRate}
                                    onChange={(e) => setInterestRate(Number(e.target.value))}
                                    className="pl-9"
                                    step={0.1}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Loan Term (Years)</Label>
                            <Input
                                type="number"
                                value={loanTerm}
                                onChange={(e) => setLoanTerm(Number(e.target.value))}
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-muted-foreground">Estimated Monthly Payment</span>
                        <span className="text-3xl font-bold text-primary">
                            ${monthlyPayment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                        </span>
                    </div>
                    <p className="text-xs text-muted-foreground text-right">
                        *Excludes taxes and insurance
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}
