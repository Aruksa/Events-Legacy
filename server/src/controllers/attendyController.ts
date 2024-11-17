import { Request, Response } from "express";
import { Attendy } from "../models";

// If attendy exist then updated if not than create attendy
export const createUpdateAttendy = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const userId = (req as any).user?.id;

  const attendy = await Attendy.findOne({ where: { eventId, userId } });
  const { status } = req.body;
  if (!attendy) {
    try {
      const newAttendy = await Attendy.create({
        status,
        eventId,
        userId,
      });

      res
        .status(201)
        .json({ message: "Attendy created successfully", data: newAttendy });
      return;
    } catch (err) {
      res.status(500).json({ message: "Failed to create attendy", err });
      return;
    }
  } else {
    try {
      await attendy.update({ status });

      res
        .status(201)
        .json({ message: "Attendy updated successfully", data: attendy });
    } catch (err) {
      res.status(500).json({ message: "Failed to update attendy", err });
      return;
    }
  }
};

// If login user give attendy previously
export const getAttendy = async (req: Request, res: Response) => {
  const { eventId } = req.params;
  const userId = (req as any).user?.id;

  try {
    const attendy = await Attendy.findOne({
      where: { eventId, userId },
      attributes: ["status"],
    });
    if (attendy) {
      res.status(200).json(attendy.dataValues);
    } else {
      res.status(200).json({ status: 0 });
      return;
    }

    return;
  } catch (error) {
    res.status(500).json({ message: "Error retrieving attendy", error });
    return;
  }
};

// All attendy related to the event
export const getAllEventAttendy = async (req: Request, res: Response) => {
  const { eventId } = req.params;

  const attendy = await Attendy.findAll({
    where: { eventId },
    //attributes: ["status"],
  });
  //console.log("att: ", attendy);
  const arrStatus: number[] = attendy.map((a) => a.dataValues.status);
  const arrUserId: number[] = attendy.map((a) => a.dataValues.userId);
  console.log("Event Attendy: : ", arrUserId);
  // for (let i = 0; i < attendy.length; i++) {
  //   const val = attendy[i].dataValues.status;
  //   arrStatus.push(val);
  // }

  if (attendy) {
    res.status(200).json({ arrStatus, arrUserId });
  } else {
    const emptyArr: number[] = [];
    res.status(200).json({ emptyArr });
    return;
  }
  //if (attendy) res.status(200).json({ data: attendy });
};
