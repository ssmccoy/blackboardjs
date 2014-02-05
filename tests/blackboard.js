var FOO = "foo";
var BAR = "bar";

require( [ "blackboard" ],
    function (Blackboard) {
        describe( "Generate Blackboard Test", function () {
            it( "Is Alive!", function () {
                var blackboard = new Blackboard();

                expect(blackboard).toBeTruthy();
            });

            it( "Simple Watcher", function () {
                var blackboard = new Blackboard();

                var runs = {}
                runs[ FOO + BAR ] = false;
                runs[ FOO ] = false;
                runs[ BAR ] = false;

                blackboard.watch( [ FOO, BAR ], function (foo, bar) {
                    expect(foo).toBe(FOO);
                    expect(bar).toBe(BAR);
                    runs[ FOO + BAR ] = true;
                });

                blackboard.watch( FOO, function (foo) {
                    expect(foo).toBe(FOO);
                    runs[ FOO ] = true;
                });

                blackboard.watch( BAR, function (bar) {
                    expect(bar).toBe(BAR);
                    runs[ BAR ] = true;
                });

                blackboard.put( FOO, "foo" );
                blackboard.put( BAR, "bar" );

                expect(runs[ FOO + BAR ]).toBeTruthy();
                expect(runs[ FOO ]).toBeTruthy();
                expect(runs[ BAR ]).toBeTruthy();
            });

            it( "Watch Published Values", function () {
                var blackboard = new Blackboard();

                var runs = {}
                runs[ FOO + BAR ] = false;
                runs[ FOO ] = false;
                runs[ BAR ] = false;

                blackboard.put( FOO, "foo" );
                blackboard.put( BAR, "bar" );

                blackboard.watch( [ FOO, BAR ], function (foo, bar) {
                    expect(foo).toBe(FOO);
                    expect(bar).toBe(BAR);
                    runs[ FOO + BAR ] = true;
                });

                blackboard.watch( FOO, function (foo) {
                    expect(foo).toBe(FOO);
                    runs[ FOO ] = true;
                });

                blackboard.watch( BAR, function (bar) {
                    expect(bar).toBe(BAR);
                    runs[ BAR ] = true;
                });

                expect(runs[ FOO + BAR ]).toBeTruthy();
                expect(runs[ FOO ]).toBeTruthy();
                expect(runs[ BAR ]).toBeTruthy();
            });

            it( "Hangup Terminates", function () {
                var blackboard = new Blackboard();

                blackboard.hangup();

                blackboard.put( FOO, "foo" );

                blackboard.watch( FOO, function (foo) {
                    expect(false).toBeTruthy();
                });
            });
        });
    }
);
